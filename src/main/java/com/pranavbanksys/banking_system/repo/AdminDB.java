package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminDB extends JpaRepository<AdminDetails, Long> {
}
