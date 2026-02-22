package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.AdminDB;
import com.pranavbanksys.banking_system.repo.AdminDetails;
import com.pranavbanksys.banking_system.service.AdminService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LoginAdmin {


    private final AdminDB adminDB;
    private final AdminService adminService;

    @PostMapping("/loginAdmin")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String>credentials, HttpSession session){
        try{
            String aEmail=credentials.get("email");
            String aPassword=credentials.get("password");
            AdminDetails admin= adminService.logAdmin(aEmail,aPassword);
            session.setAttribute("currentAdmin",admin);
            return ResponseEntity.ok(Map.of("adminName",admin.getAName()));
        }
        catch(IllegalStateException e){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error",e.getMessage()));
        }
    }
}
