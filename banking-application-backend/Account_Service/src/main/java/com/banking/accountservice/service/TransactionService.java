package com.banking.accountservice.service;

import com.banking.accountservice.kafka.TransactionEvent;
import com.banking.accountservice.kafka.TransactionEventProducer;
import com.banking.accountservice.model.Account;
import com.banking.accountservice.model.Transaction;
import com.banking.accountservice.repository.AccountRepository;
import com.banking.accountservice.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;


import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionEventProducer transactionEventProducer;

    @Autowired
    private RestTemplate restTemplate; // injected RestTemplate

    private final String USER_SERVICE_URL = "http://localhost:8081/users"; // UserService base URL

    // Deposit money into an account
    public Transaction deposit(Long accountId, Double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));

        validateUser(account.getUserId());

        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType("DEPOSIT");
        transaction.setAmount(amount);
        transaction.setDate(new Date());
        transaction.setStatus("APPROVED");           // ✅ auto-approve
        transaction.setApproved(true);
        transaction.setApprovedByEmployeeId(1L);     // system / auto approval

        transaction = transactionRepository.save(transaction);

        // Send Kafka event
        sendTransactionEvent(transaction, "DEPOSIT", "Deposit successful");

        return transaction;
    }

    // Withdraw money from an account
    public Transaction withdraw(Long accountId, Double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));

        validateUser(account.getUserId());

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance!");
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType("WITHDRAW");
        transaction.setAmount(amount);
        transaction.setDate(new Date());
        transaction.setStatus("APPROVED");
        transaction.setApproved(true);
        transaction.setApprovedByEmployeeId(1L);

        transaction = transactionRepository.save(transaction);

        // Send Kafka event
        sendTransactionEvent(transaction, "WITHDRAW", "Withdraw successful");

        return transaction;
    }

    @Transactional
    public List<Transaction> transfer(Long fromAccountId, Long toAccountId, Double amount) {
        if (fromAccountId.equals(toAccountId)) {
            throw new RuntimeException("Cannot transfer to the same account!");
        }

        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // Validate users (your existing method)
        validateUser(fromAccount.getUserId());
        validateUser(toAccount.getUserId());

        if (fromAccount.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance in source account!");
        }

        // Update balances
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create Debit Transaction
        Transaction debitTx = new Transaction();
        debitTx.setAccount(fromAccount);
        debitTx.setTransactionType("TRANSFER_OUT");
        debitTx.setAmount(amount);
        debitTx.setDate(new Date());
        debitTx.setStatus("APPROVED");
        debitTx.setApproved(true);
        debitTx.setApprovedByEmployeeId(1L); // hardcoded example
        debitTx.setCounterpartyAccountId(toAccount.getId());

        transactionRepository.save(debitTx);

        // Create Credit Transaction
        Transaction creditTx = new Transaction();
        creditTx.setAccount(toAccount);
        creditTx.setTransactionType("TRANSFER_IN");
        creditTx.setAmount(amount);
        creditTx.setDate(new Date());
        creditTx.setStatus("APPROVED");
        creditTx.setApproved(true);
        creditTx.setApprovedByEmployeeId(1L);
        creditTx.setCounterpartyAccountId(fromAccount.getId());

        transactionRepository.save(creditTx);

        // Send Kafka events (helper method)

// inside transfer()

// Send Kafka events
        sendTransactionEvent(debitTx, "TRANSFER_OUT", "Transfer to account " + toAccountId);
        sendTransactionEvent(creditTx, "TRANSFER_IN", "Transfer from account " + fromAccountId);

        // ✅ Return both transactions
        return List.of(debitTx, creditTx);
    }


    // Get all transactions of a specific account
    public List<Transaction> getTransactionsByAccount(Long accountId) {
        accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id " + accountId));
        return transactionRepository.findByAccount_Id(accountId);
    }

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Validate user in UserService
    private void validateUser(Long userId) {
        String url = USER_SERVICE_URL + "/" + userId;
        Object userResponse = restTemplate.getForObject(url, Object.class);
        if (userResponse == null) {
            throw new RuntimeException("User not found in UserService with id: " + userId);
        }
    }

    // Helper: get user email
    private String getUserEmail(Long userId) {
        String url = USER_SERVICE_URL + "/" + userId;
        Map<String, Object> user = restTemplate.getForObject(url, Map.class);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return (String) user.get("email");
    }

    // Helper: send Kafka event
    private void sendTransactionEvent(Transaction transaction, String type, String description) {
        Account account = transaction.getAccount();

        TransactionEvent event = new TransactionEvent(
                transaction.getId(),                // Transaction ID
                account.getId(),                    // Account ID
                account.getUserId(),                // User ID
                getUserEmail(account.getUserId()),  // User Email
                type,                               // Type (DEPOSIT/WITHDRAW/TRANSFER)
                transaction.getAmount(),            // Amount
                description                         // Description
        );

        transactionEventProducer.sendTransactionEvent(event);
    }
}
