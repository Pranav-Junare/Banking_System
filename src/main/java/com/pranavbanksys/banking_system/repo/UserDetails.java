package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//For test, use test1 both as mail and password

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uID;

    @Column(nullable = false)
    private String uName;
    
    @Column(nullable = false, unique = true)
    private String uEmail;
    
    @Column(nullable = false)
    private String uPassword;
    
    @Column(nullable = true)
    private Long phoneNumber;
    
    @Column(nullable = false)
    private Long accountBalance;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    @Column(nullable = false)
    private com.pranavbanksys.banking_system.enums.KycStatus kycStatus = com.pranavbanksys.banking_system.enums.KycStatus.PENDING;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    @Column(nullable = false)
    private com.pranavbanksys.banking_system.enums.AccountStatus accountStatus = com.pranavbanksys.banking_system.enums.AccountStatus.ACTIVE;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    @Column(nullable = false)
    private com.pranavbanksys.banking_system.enums.AccountTier accountTier = com.pranavbanksys.banking_system.enums.AccountTier.TIER_1;

    @Column(nullable = false)
    private Boolean mfaEnabled = true;

    @Column(nullable = false)
    private Long dailyLimit = 1000L;

}