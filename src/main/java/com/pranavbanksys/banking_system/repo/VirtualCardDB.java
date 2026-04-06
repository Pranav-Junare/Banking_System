package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VirtualCardDB extends JpaRepository<VirtualCard, Long> {
    List<VirtualCard> findByAccountEmail(String accountEmail);
    Optional<VirtualCard> findByPan(String pan);
}
