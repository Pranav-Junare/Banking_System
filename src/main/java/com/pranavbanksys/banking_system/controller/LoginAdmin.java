package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.AdminDB;
import com.pranavbanksys.banking_system.repo.AdminDetails;
import com.pranavbanksys.banking_system.service.AdminService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LoginAdmin {


    private final AdminDB adminDB;
    private final AdminService adminService;

    @PostMapping("/loginAdmin")
    public String loginAdmin(@ModelAttribute AdminDetails adminDetails, HttpSession session){
        try{
        AdminDetails admin= adminService.logAdmin(adminDetails.getAEmail(),adminDetails.getAPassword());
        session.setAttribute("currentAdmin",admin);
        return "Logged in as admin, Welcome "+admin.getAName();
        }
        catch(IllegalStateException e){
            return e.getMessage();
        }
    }
}
