package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankServiceRequestDB extends JpaRepository<BankServiceRequest, Long> {
    List<BankServiceRequest> findByAccountEmail(String accountEmail);
}
