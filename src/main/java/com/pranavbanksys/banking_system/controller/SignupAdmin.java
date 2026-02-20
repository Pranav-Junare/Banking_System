package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.AdminDetails;
import com.pranavbanksys.banking_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SignupAdmin {
    private final AdminService adminService;

    @PostMapping("/signupAdmin")
    public String signup(@ModelAttribute AdminDetails adminDetails){
        try{
            adminService.registerAdmin(adminDetails);
            return "Signup successfully";
        }
        catch(IllegalStateException e){
            return e.getMessage();
        }
    }
}
