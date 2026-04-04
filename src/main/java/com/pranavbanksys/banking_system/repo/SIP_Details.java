package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "sip_details")
@NoArgsConstructor
@AllArgsConstructor
public class SIP_Details {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountHolderName;
    private String accountEmail;
    private String sipType;
    private Double sipAmount;
    private Integer sipDuration; // in months
    private Double sipInterestRate;
    private Double sipMaturityAmount;
    private String sipStartDate;
    private String sipMaturityDate;
    private String sipStatus; // ACTIVE, MATURED, etc.
}