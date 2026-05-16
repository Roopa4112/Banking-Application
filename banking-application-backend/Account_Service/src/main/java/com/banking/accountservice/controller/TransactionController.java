package com.banking.accountservice.controller;

import com.banking.accountservice.model.Transaction;
import com.banking.accountservice.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Deposit endpoint
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.valueOf(payload.get("accountId").toString());
            double amount = Double.parseDouble(payload.get("amount").toString());

            Transaction transaction = transactionService.deposit(accountId, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Withdraw endpoint
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> payload) {
        try {
            Long accountId = Long.valueOf(payload.get("accountId").toString());
            double amount = Double.parseDouble(payload.get("amount").toString());
            Transaction transaction = transactionService.withdraw(accountId, amount);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Transfer endpoint
    // Transfer money between accounts using path variables
//    @PostMapping("/transfer/{fromAccountId}/{toAccountId}")
//    public ResponseEntity<?> transfer(
//            @PathVariable Long fromAccountId,
//            @PathVariable Long toAccountId,
//            @RequestParam Double amount) {
//        try {
//            Transaction transaction = transactionService.transfer(fromAccountId, toAccountId, amount);
//            return ResponseEntity.ok(transaction);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @RequestBody Map<String, Object> payload) {
        try {
            Long fromAccountId = Long.valueOf(payload.get("fromAccountId").toString());
            Long toAccountId = Long.valueOf(payload.get("toAccountId").toString());
            Double amount = Double.valueOf(payload.get("amount").toString());
            List<Transaction> transactions = transactionService.transfer(fromAccountId, toAccountId, amount);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



    // Get all transactions of an account
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long accountId) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByAccount(accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get all transactions
    @GetMapping
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
}
