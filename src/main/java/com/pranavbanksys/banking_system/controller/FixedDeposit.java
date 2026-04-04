package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.FixedDeposit_Service;
import com.pranavbanksys.banking_system.repo.FixedDeposit_Details;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FixedDeposit {
    private final FixedDeposit_Service fixedDepositService;

    @PostMapping("/create-fd")
    public ResponseEntity<?> createFixedDeposit(@RequestBody FDRequest request, HttpSession session) {
        try {
            // 1. Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;    

            // 2. Process the FD creation via Service
            fixedDepositService.createFixedDeposit(
                currentUser.getUEmail(), 
                request.getFdType(), 
                request.getFdAmount(), 
                request.getFdDuration()
            );
            return ResponseEntity.ok("Fixed Deposit created successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-fds")
    public ResponseEntity<?> viewMyFDs(HttpSession session) {
        try {
            // 1. Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // 2. Fetch the FDs for this specific user
            var myFDs = fixedDepositService.getMyFDs(currentUser.getUEmail());

            // 3. Return the full list of FD details as JSON
            return ResponseEntity.ok(myFDs);

        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    static class FDRequest {
        private String fdType;
        private Double fdAmount;
        private Integer fdDuration; // in months
    }
}