package com.pranavbanksys.banking_system.repo;

import com.pranavbanksys.banking_system.enums.KycStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class KycRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    private String legalName;
    private String dob;
    private String gender;

    @Column(nullable = false)
    private String documentType;

    @Column(nullable = false)
    private String documentNumber;

    private String streetAddress;
    private String city;
    private String state;
    private String pinCode;
    private Boolean sameAddress;

    private String employmentStatus;
    private String annualIncome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus status = KycStatus.PENDING;
}
