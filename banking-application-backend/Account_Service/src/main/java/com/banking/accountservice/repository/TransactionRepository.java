package com.banking.accountservice.repository;

import com.banking.accountservice.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByTransactionType(String transactionType);

    // ✅ Corrected to use account.id from the relation
    List<Transaction> findByAccount_Id(Long accountId);
}
