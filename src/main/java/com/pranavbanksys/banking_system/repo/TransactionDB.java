package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionDB extends JpaRepository<TransactionDetails, String> {
    boolean existsByTransactionID(String transactionID);

    List<TransactionDetails>findByFromUser(String email);
}
