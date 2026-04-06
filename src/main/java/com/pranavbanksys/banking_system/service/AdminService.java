package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.AdminDB;
import com.pranavbanksys.banking_system.repo.AdminDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminDB adminDB;
    private final PasswordEncoder passwordEncoder;

    public AdminDetails logAdmin(String email, String password){
        AdminDetails adminDetails=adminDB.findByaEmail(email);
        if(adminDetails==null) throw new IllegalStateException("Admin not found");

        if(!passwordEncoder.matches(password, adminDetails.getAPassword())) throw new IllegalStateException("Wrong password");

        return adminDetails;
    }

    public void registerAdmin(AdminDetails adminDetails){
        if (adminDB.existsByaEmail(adminDetails.getAEmail())){
            throw new IllegalStateException("Email already registered, please login");
        }
        adminDetails.setAPassword(passwordEncoder.encode(adminDetails.getAPassword()));
        adminDB.save(adminDetails);
    }
}
