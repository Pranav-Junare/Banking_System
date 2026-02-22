package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.AdminDetails;
import com.pranavbanksys.banking_system.service.AdminService;
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
public class SignupAdmin {
    private final AdminService adminService;

    @PostMapping("/signupAdmin")
    public ResponseEntity<?> signup(@RequestBody AdminDetails adminDetails){
        try{
            adminService.registerAdmin(adminDetails);
            return ResponseEntity.ok(Map.of("message","Admin signed in successfully"));
        }
        catch(IllegalStateException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
