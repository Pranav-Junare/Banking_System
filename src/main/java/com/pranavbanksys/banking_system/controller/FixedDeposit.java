package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.FixedDeposit_Service;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FixedDeposit {
    private final FixedDeposit_Service fixedDepositService;

    @PostMapping("/create-fd")
    public ResponseEntity<?> createFixedDeposit(@RequestBody FDRequest request, HttpSession session) {
        try {
            // Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // Process the FD creation via Service
            fixedDepositService.createFixedDeposit(
                    currentUser.getUEmail(),
                    request.getFdType(),
                    request.getFdAmount(),
                    request.getFdDuration()
            );

           // Return success message as JSON
            return ResponseEntity.ok(Map.of("message", "Fixed Deposit created successfully"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-fds")
    public ResponseEntity<?> viewMyFDs(HttpSession session) {
        try {
            // Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // Fetch the user's FDs via Service
            var myFDs = fixedDepositService.getMyFDs(currentUser.getUEmail());

            // Return the list of FDs as JSON
            return ResponseEntity.ok(myFDs);

        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
// DTO for FD creation request
    @Data
    static class FDRequest {
        private String fdType;
        private Double fdAmount;
        private Integer fdDuration; // in months
    }
}