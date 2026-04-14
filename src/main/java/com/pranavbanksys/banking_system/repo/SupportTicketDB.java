package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketDB extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserEmail(String userEmail);
    List<SupportTicket> findByStatus(String status);
}
