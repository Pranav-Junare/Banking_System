package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
<<<<<<< HEAD

=======
import lombok.Data;

@Data
>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
@Entity
@Table(name = "loan_details")
public class LoanDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String accountEmail;
    private Double amount;
<<<<<<< HEAD
=======
    private String loanType;
>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
    private Double interestRate;
    private Integer tenure;
    private Double monthlyPayment;
    private Double totalPayment;
    private Double totalInterest;
    private String status;
    private String createdAt;
    private String updatedAt;
<<<<<<< HEAD
    
=======

>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
}