package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    private String uName;
    private String uEmail;
    private String uPassword;
    private Long phoneNumber;
    private Long accountBalance;

}