package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PotDB extends JpaRepository<PotDetails, Long> {
    List<PotDetails> findByAccountEmail(String accountEmail);
}
