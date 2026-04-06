package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class VirtualCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountEmail; // Link to user
    private String pan; // 16 digit PAN
    private String cvv; // 3 digit CVV
    private String expiryDate; // MM/YY format
    
    private Boolean isActive;
    private Double dailyLimit;
    private Double currentDaySpent; // Accumulated today
    private String lastSpentDate; // YYYY-MM-DD
    
    private String hashedPin; // BCrypt mock
    private String creationDate;
}
