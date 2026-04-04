package com.pranavbanksys.banking_system.repo;  

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixedDeposit_DB extends JpaRepository<FixedDeposit_Details, Long> {
   // check if fdType exists for validation
    boolean existsByFdType(String fdType);
    // find fd by fdType and accountEmail for specific user and type retrieval
    List<FixedDeposit_Details> findByFdType(String fdType);
    
    List<FixedDeposit_Details> findByAccountEmail(String accountEmail);
}