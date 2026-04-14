package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.AdminDetails;
import com.pranavbanksys.banking_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class SignupAdmin {
    private final AdminService adminService;

    @PostMapping("/signupAdmin")
    public ResponseEntity<?> signup(@RequestBody AdminDetails adminDetails) {
        try {
            adminService.registerAdmin(adminDetails);
            return ResponseEntity.ok(Map.of("message", "Admin signed in successfully"));
        }
        catch(IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
        catch(Exception e) {
            log.error("Error during admin signup: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An error occurred during signup. Please check your input and try again."));
        }
    }
}
