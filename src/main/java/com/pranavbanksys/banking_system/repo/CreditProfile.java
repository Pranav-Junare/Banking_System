package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class CreditProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountEmail;
    
    private Double creditLimit;
    private Double overdraftLimit;
    
    private Double pendingCreditBalance; // Accumulated credit transactions
    private Double statementBalance; // Statement generated at month end
    
    private Double monthlyIncome;
    private Double monthlyDebt;
    
    private Double repaymentHistoryScore; // 0 to 1 scaling (e.g. 0.95 = 95% on-time)
    private Integer accountAgeMonths; 
}
