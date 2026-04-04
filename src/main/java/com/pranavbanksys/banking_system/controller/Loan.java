package com.pranavbanksys.banking_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.pranavbanksys.banking_system.service.LoanService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class Loan {

    private final LoanService loanService;

    @PostMapping("/apply-loan")
    public ResponseEntity<?> applyForLoan(@RequestBody LoanRequest request, HttpSession session) {
        try {
            //session se user ko get karega
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // loan process ke liye loanService ko call karega
            loanService.applyForLoan(
                currentUser.getUEmail(), 
                request.getLoanType(), 
                request.getAmount(), 
                request.getTenure()
            );
            return ResponseEntity.ok("Loan applied successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // A simple DTO (Data Transfer Object) class to capture incoming JSON
    @Data
    public static class LoanRequest {
        private String accountEmail;
        private String loanType;
        private int amount;
        private int tenure;
    }
}