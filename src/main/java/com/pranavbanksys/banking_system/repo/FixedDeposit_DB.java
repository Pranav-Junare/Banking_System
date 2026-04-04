package com.pranavbanksys.banking_system.repo;  

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixedDeposit_DB extends JpaRepository<FixedDeposit_Details, Long> {
    boolean existsByFdType(String fdType);
    List<FixedDeposit_Details> findByFdType(String fdType);
    
    List<FixedDeposit_Details> findByAccountEmail(String accountEmail);
}