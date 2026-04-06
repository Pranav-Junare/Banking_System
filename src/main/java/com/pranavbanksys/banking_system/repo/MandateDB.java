package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MandateDB extends JpaRepository<Mandate, Long> {
    List<Mandate> findByAccountEmail(String accountEmail);
    List<Mandate> findByIsActiveTrue();
}
