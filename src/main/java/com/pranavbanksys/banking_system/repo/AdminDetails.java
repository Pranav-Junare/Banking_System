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

    private String aName;
    private String aPassword;
    private String aEmail;
}
