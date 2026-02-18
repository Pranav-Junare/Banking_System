package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDB extends JpaRepository<UserDetails, Long> {
//    Custom search function to find by email
    boolean existsByuEmail(String uEmail);
    UserDetails findByuEmail(String uEmail);
}
