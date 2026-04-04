package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SIP_DB extends JpaRepository<SIP_Details, Long> {
    // check if sipType exists for validation
    boolean existsBySipType(String sipType);

    // find sip by sipType and accountEmail for specific user and type retrieval
    List<SIP_Details> findBySipType(String sipType);

    // find all SIPs for a specific user based on their email
    List<SIP_Details> findByAccountEmail(String accountEmail);
}