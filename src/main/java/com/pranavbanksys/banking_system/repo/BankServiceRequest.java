package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class BankServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountEmail;
    private String requestType; // CHEQUEBOOK, DEBIT_CARD_REPLACEMENT, etc.
    private String requestStatus; // REQUESTED, PROCESSING, DISPATCHED
    private Double applicableFee;
    private String creationDate;
    private String updateDate;
}
