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
        // Calculate EMI (Equated Monthly Installment)
        // Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
        // Where P = Principal (amount), r = Monthly Interest Rate, n = Tenure in Months
        double monthlyInterestRate = (interestRate / 100.0) / 12.0;
        
        double monthlyPayment;
        double totalPayment;
        double totalInterest;

        if (monthlyInterestRate > 0 && tenure > 0) {
            double mathPower = Math.pow(1 + monthlyInterestRate, tenure);
            monthlyPayment = amount * monthlyInterestRate * (mathPower / (mathPower - 1));
            totalPayment = monthlyPayment * tenure;
            totalInterest = totalPayment - amount;
        } else {
            // Edge case: 0% interest rate or 0 tenure
            monthlyPayment = tenure > 0 ? (double) amount / tenure : amount;
            totalPayment = amount;
            totalInterest = 0.0;
        }

        //  Set the attributes on loanDetails
        loanDetails.setAccountEmail(accountEmail);
        loanDetails.setAmount((double) amount);
        loanDetails.setInterestRate((double) interestRate);
        loanDetails.setTenure(tenure);
        loanDetails.setTotalInterest(totalInterest);
        loanDetails.setTotalPayment(totalPayment);
        loanDetails.setMonthlyPayment(monthlyPayment);

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