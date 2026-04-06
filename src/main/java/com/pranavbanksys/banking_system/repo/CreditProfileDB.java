package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CreditProfileDB extends JpaRepository<CreditProfile, Long> {
    Optional<CreditProfile> findByAccountEmail(String accountEmail);
}
