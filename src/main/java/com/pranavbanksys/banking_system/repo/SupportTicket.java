package com.pranavbanksys.banking_system.repo;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String userEmail;
    private String ticketType; // e.g., CARD_UNFREEZE
    private String targetId; // reference ID, e.g., card Id
    private String description;
    private String status; // OPEN, RESOLVED, REJECTED
    private String createdAt;
}
