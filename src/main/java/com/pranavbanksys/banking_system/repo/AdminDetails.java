package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aID;

    @Column(nullable = false)
    private String aName;
    
    @Column(nullable = false)
    private String aPassword;
    
    @Column(nullable = false, unique = true)
    private String aEmail;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    // @Column(nullable = false)
    private com.pranavbanksys.banking_system.enums.AdminRole role = com.pranavbanksys.banking_system.enums.AdminRole.SUPPORT_AGENT;
}
