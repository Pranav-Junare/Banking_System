package com.pranavbanksys.banking_system.repo;

import java.util.List;
<<<<<<< HEAD

import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDB extends JpaRepository<LoanDetails,Long>{
=======
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanDB extends JpaRepository<LoanDetails, Long> {
>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
    boolean existsByAccountEmail(String accountEmail);
    List<LoanDetails> findByStatus(String status);
    List<LoanDetails> findByAccountEmail(String accountEmail);
}