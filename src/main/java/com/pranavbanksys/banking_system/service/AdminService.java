package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.AdminDB;
import com.pranavbanksys.banking_system.repo.AdminDetails;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminDB adminDB;

    public AdminDetails logAdmin(String email,String password){
        AdminDetails adminDetails=adminDB.findByaEmail(email);
        if(adminDetails==null) throw new IllegalStateException("Admin not found");

        if(!adminDetails.getAPassword().equals(password)) throw new IllegalStateException("Wring password");

        return adminDetails;
    }

    public void registerAdmin(AdminDetails adminDetails){
        if (adminDB.existsByaEmail(adminDetails.getAEmail())){
            throw new IllegalStateException("Email already registered, please login");
        }
        adminDB.save(adminDetails);
    }
}
