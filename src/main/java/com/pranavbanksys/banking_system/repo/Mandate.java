package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Mandate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountEmail; // Link to user
    private String billerName;
    private String consumerId;
    private Double amount;
    private Integer executionDayOfMonth; // 1 to 28
    private Boolean isActive;
    private String lastExecutionDate;
}
