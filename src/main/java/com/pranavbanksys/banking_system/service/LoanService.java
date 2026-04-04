package com.pranavbanksys.banking_system.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pranavbanksys.banking_system.repo.LoanDB;
import com.pranavbanksys.banking_system.repo.LoanDetails;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoanService {
    private final LoanDB loanDB;
    private final UserDB userDB;

    public UserDetails getUser(String email) {
        UserDetails user = userDB.findByuEmail(email);

        // If user is null or email is null, throw error
        if (user == null || user.getUEmail() == null) {
            throw new IllegalStateException("No user found");
        }

        return user;
    }

    // Moved applyForLoan outside of getUser() to be properly defined
    @Transactional
    public void applyForLoan(String accountEmail, String loanType, int amount, int tenure) {
        // 1. Fetch the user. This makes 'user.getAccountBalance()' available.
        UserDetails user = getUser(accountEmail);

        // 2. Determine the interest rate based on loanType instead of taking it from user input
        int interestRate = getInterestRate(loanType);

        // 3. Create a new instance of LoanDetails
        LoanDetails loanDetails = new LoanDetails();
        
        // 4. Set the attributes on the specific 'loanDetails' instance, not the 'LoanDetails' class
        loanDetails.setAccountBalance(user.getAccountBalance() + amount);
        loanDetails.setAccountEmail(accountEmail);
        loanDetails.setAmount(amount);
        loanDetails.setInterestRate(interestRate);
        loanDetails.setTenure(tenure);
        loanDetails.setMonthlyPayment(amount / tenure);
        
        // Calculate totals
        int totalInterest = (amount * interestRate * tenure) / 100;
        loanDetails.setTotalPayment(amount + totalInterest);
        loanDetails.setTotalInterest(totalInterest);
        
        loanDetails.setStatus("Pending");
        loanDetails.setCreatedAt(LocalDateTime.now());
        loanDetails.setUpdatedAt(LocalDateTime.now());
        
        // 5. Save the specific instance
        loanDB.save(loanDetails);
    }

    // Helper method to provide predefined interest rates based on common loan types
    private int getInterestRate(String loanType) {
        if (loanType == null) return 12; // Default interest rate
        
        switch (loanType.toUpperCase()) {
            case "HOME":
                return 8; // 8% interest
            case "EDUCATION":
                return 10; // 10% interest
            case "CAR":
                return 9; // 9% interest
            case "PERSONAL":
                return 14; // 14% interest
            default:
                return 12; // Default rate for any other type
        }
    }
}