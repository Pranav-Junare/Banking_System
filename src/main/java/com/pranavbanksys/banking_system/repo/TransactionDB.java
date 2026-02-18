package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionDB extends JpaRepository<TransactionDetails, String> {
    boolean existsByTransactionID(String transactionID);
}
