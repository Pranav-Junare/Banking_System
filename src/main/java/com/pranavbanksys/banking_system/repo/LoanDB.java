package com.pranavbanksys.banking_system.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDB extends JpaRepository<LoanDetails, Long> {
    boolean existsByAccountEmail(String accountEmail);
    List<LoanDetails> findByStatus(String status);
    List<LoanDetails> findByAccountEmail(String accountEmail);
}