package com.pranavbanksys.banking_system.service;

import java.time.LocalDateTime;
import java.util.List;

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


    @Transactional
    public void applyForLoan(String accountEmail, String loanType, int amount, int tenure) {
        // Fetch the user to apply the loan amount to their balance
        UserDetails user = getUser(accountEmail);

        // Determine the interest rate based on loanType
        int interestRate = getInterestRate(loanType);

        // Create a new instance of LoanDetails
        LoanDetails loanDetails = new LoanDetails();

        //  Update User's balance
        user.setAccountBalance(user.getAccountBalance() + amount);
        loanDetails.setLoanType(loanType.toUpperCase());
        // Convert months to years for the interest formula
        double timeInYears = tenure / 12.0;

        // Calculate Simple Interest: (P * R * T) / 100
        double totalInterest = (amount * interestRate * timeInYears) / 100.0;

        // Total amount to be repaid
        double totalPayment = amount + totalInterest;

        // EMI (Equated Monthly Installment)
        double monthlyPayment = totalPayment / tenure;

        //  Set the attributes on loanDetails
        loanDetails.setAccountEmail(accountEmail);
        loanDetails.setAmount((double) amount);
        loanDetails.setInterestRate((double) interestRate);
        loanDetails.setTenure(tenure);
        loanDetails.setTotalInterest((double) totalInterest);
        loanDetails.setTotalPayment((double) totalPayment);
        loanDetails.setMonthlyPayment((double) monthlyPayment);

        loanDetails.setStatus("Pending");
        loanDetails.setCreatedAt(String.valueOf(LocalDateTime.now()));
        loanDetails.setUpdatedAt(String.valueOf(LocalDateTime.now()));

        //  Save the loan record
        loanDB.save(loanDetails);
    }

    // Fetches all loans belonging to a specific email
    public List<LoanDetails> getMyLoans(String email) {
        return loanDB.findByAccountEmail(email);
    }

    // Helper method to provide predefined annual interest rates
    private int getInterestRate(String loanType) {
        if (loanType == null) return 12; // Default interest rate

        return switch (loanType.toUpperCase()) {
            case "HOME" -> 8; // 8% interest
            case "EDUCATION" -> 10; // 10% interest
            case "CAR" -> 9; // 9% interest
            case "PERSONAL" -> 14; // 14% interest
            default -> 12; // Default rate for any other type
        };
    }
}