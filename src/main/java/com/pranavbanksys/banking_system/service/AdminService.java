package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.AdminDB;
import com.pranavbanksys.banking_system.repo.AdminDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final AdminDB adminDB;
    private final PasswordEncoder passwordEncoder;

    public AdminDetails logAdmin(String email, String password) {
        AdminDetails adminDetails = adminDB.findByaEmail(email);
        if(adminDetails == null) {
            throw new IllegalStateException("Admin not found");
        }

        if(!passwordEncoder.matches(password, adminDetails.getAPassword())) {
            throw new IllegalStateException("Wrong password");
        }

        return adminDetails;
    }

    public void registerAdmin(AdminDetails adminDetails) {
        
        // Validate input
        if (adminDetails == null || adminDetails.getAEmail() == null || adminDetails.getAEmail().trim().isEmpty()) {
            throw new IllegalStateException("Email is required");
        }
        if (adminDetails.getAName() == null || adminDetails.getAName().trim().isEmpty()) {
            throw new IllegalStateException("Name is required");
        }
        if (adminDetails.getAPassword() == null || adminDetails.getAPassword().trim().isEmpty()) {
            throw new IllegalStateException("Password is required");
        }
        
        if (adminDB.existsByaEmail(adminDetails.getAEmail())) {
            log.warn("Admin signup attempt with existing email: {}", adminDetails.getAEmail());
            throw new IllegalStateException("Email already registered, please login");
        }
        
        adminDetails.setAPassword(passwordEncoder.encode(adminDetails.getAPassword()));
        
        try {
            adminDB.save(adminDetails);
            log.info("Admin registered successfully: {}", adminDetails.getAEmail());
        } catch (Exception e) {
            log.error("Error saving admin to database - Details: {}", e.getMessage(), e);
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("Duplicate")) {
                throw new IllegalStateException("Email already exists. Please use a different email.");
            }
            throw new IllegalStateException("Database error: " + (errorMsg != null ? errorMsg : "Failed to create admin account. Please try again."));
        }
    }

    // Role-based actions can be guarded by @PreAuthorize if Spring Security method security is enabled
    // For now, these are core logic methods

    public void freezeUser(String adminEmail, Long userId, String reason) {
        // typically we would inject UserDB and AuditLogRepo here, but they aren't injected yet.
    }

    public void approveKyc(String adminEmail, Long userId) {
    }

    public void reverseTransaction(String adminEmail, String transactionId) {
    }
}
