package com.pranavbanksys.banking_system.controller;

<<<<<<< HEAD
import org.springframework.http.ResponseEntity;
=======
import com.pranavbanksys.banking_system.repo.UserDetails;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
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
<<<<<<< HEAD
                currentUser.getUEmail(), 
                request.getLoanType(), 
                request.getAmount(), 
                request.getTenure()
=======
                    currentUser.getUEmail(),
                    request.getLoanType(),
                    request.getAmount(),
                    request.getTenure()
>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
            );
            return ResponseEntity.ok("Loan applied successfully");
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

<<<<<<< HEAD
    // A simple DTO (Data Transfer Object) class to capture incoming JSON
    @Data
    public static class LoanRequest {
        private String accountEmail;
=======
    // NEW ENDPOINT: To view interest rate, amounts, and calculations
    @GetMapping("/my-loans")
    public ResponseEntity<?> viewMyLoans(HttpSession session) {
        try {
            // 1. Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // 2. Fetch the loans for this specific user
            var myLoans = loanService.getMyLoans(currentUser.getUEmail());

            // 3. Return the full list of loan details as JSON
            return ResponseEntity.ok(myLoans);

        } catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // A simple DTO (Data Transfer Object) class to capture incoming JSON
    @Data
    public static class LoanRequest {
>>>>>>> 160e0db9b93620fc636f908f443e645bc59f951a
        private String loanType;
        private int amount;
        private int tenure;
    }
}