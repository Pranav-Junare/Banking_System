package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
//    Used to access the user database
    private final UserDB userDB;
    private final PasswordEncoder passwordEncoder;

//    Registers and saves the data of the user in DB only if there is no same email
//    Takes Name, Email, Password, Phone Number
    public void registerUser(UserDetails userDetails) {
        
        // Validate input
        if (userDetails == null || userDetails.getUEmail() == null || userDetails.getUEmail().trim().isEmpty()) {
            throw new IllegalStateException("Email is required");
        }
        if (userDetails.getUName() == null || userDetails.getUName().trim().isEmpty()) {
            throw new IllegalStateException("Name is required");
        }
        if (userDetails.getUPassword() == null || userDetails.getUPassword().trim().isEmpty()) {
            throw new IllegalStateException("Password is required");
        }

//        In the user DB checks if the same email exists or not, if 'yes' throw error
        if(userDB.existsByuEmail(userDetails.getUEmail())) {
            log.warn("Signup attempt with existing email: {}", userDetails.getUEmail());
            throw new IllegalStateException("Email Already taken, login");
        }

//        If no then this executes, where since it's a new account, the account balance is set to 'NULL'
        if(userDetails.getAccountBalance() == null) {
            userDetails.setAccountBalance(0L);
        }
        if (userDetails.getKycStatus() == null) {
            userDetails.setKycStatus(com.pranavbanksys.banking_system.enums.KycStatus.PENDING);
        }
        if (userDetails.getAccountStatus() == null) {
            userDetails.setAccountStatus(com.pranavbanksys.banking_system.enums.AccountStatus.ACTIVE);
        }
        if (userDetails.getAccountTier() == null) {
            userDetails.setAccountTier(com.pranavbanksys.banking_system.enums.AccountTier.TIER_1);
        }
        if (userDetails.getMfaEnabled() == null) {
            userDetails.setMfaEnabled(true);
        }
        if (userDetails.getDailyLimit() == null) {
            userDetails.setDailyLimit(1000L);
        }


//        Hash the password before saving
        userDetails.setUPassword(passwordEncoder.encode(userDetails.getUPassword()));

//        Save the data to the database
        try {
            userDB.save(userDetails);
            log.info("User registered successfully: {}", userDetails.getUEmail());
        } catch (Exception e) {
            log.error("Error saving user to database - Details: {}", e.getMessage(), e);
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("Duplicate")) {
                throw new IllegalStateException("Email already exists. Please use a different email.");
            }
            throw new IllegalStateException("Database error: " + (errorMsg != null ? errorMsg : "Failed to create account. Please try again."));
        }
    }

//    Used to check if the user already exists or not and if yes, then the password is right or wrong
    public UserDetails loginUser(String email, String password) {

//        New UserDetails object, cuz have to find the email of a user
//        Value is null if email not found, if found give all the values of the user
        UserDetails user = userDB.findByuEmail(email);

//        If user=null, then not found in the DB
        if(user == null) {
            throw new IllegalStateException("User not found");
        }

//        If password does not match the entered password (using BCrypt match), then throw wrong password
        if(!passwordEncoder.matches(password, user.getUPassword())) {
            throw new IllegalStateException("Wrong Password");
        }

//        If account is SUSPENDED, block login
        if(user.getAccountStatus() == com.pranavbanksys.banking_system.enums.AccountStatus.SUSPENDED) {
            throw new IllegalStateException("Your account has been suspended. Contact admin for assistance.");
        }

//        Return the user cause it exists by mail and the password is true
        return user;
    }
}

