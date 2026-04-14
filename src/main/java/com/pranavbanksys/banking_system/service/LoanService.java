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
        if (user == null || user.getUEmail() == null) {
            throw new IllegalStateException("No user found");
        }
        return user;
    }

    // ─── Apply for Loan (PENDING_APPROVAL — does NOT credit balance) ───
    @Transactional
    public void applyForLoan(String accountEmail, String loanType, int amount, int tenure) {
        UserDetails user = getUser(accountEmail);
        int interestRate = getInterestRate(loanType);

        LoanDetails loanDetails = new LoanDetails();
        loanDetails.setLoanType(loanType.toUpperCase());

        // Calculate EMI
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
            monthlyPayment = tenure > 0 ? (double) amount / tenure : amount;
            totalPayment = amount;
            totalInterest = 0.0;
        }

        loanDetails.setAccountEmail(accountEmail);
        loanDetails.setAmount((double) amount);
        loanDetails.setInterestRate((double) interestRate);
        loanDetails.setTenure(tenure);
        loanDetails.setTotalInterest(totalInterest);
        loanDetails.setTotalPayment(totalPayment);
        loanDetails.setMonthlyPayment(monthlyPayment);
        // IMPORTANT: Status is PENDING_APPROVAL — admin must approve before balance is credited
        loanDetails.setStatus("PENDING_APPROVAL");
        loanDetails.setCreatedAt(String.valueOf(LocalDateTime.now()));
        loanDetails.setUpdatedAt(String.valueOf(LocalDateTime.now()));

        loanDB.save(loanDetails);
    }

    // ─── Admin Approves Loan — credits user balance ───
    @Transactional
    public void approveLoan(Long loanId) {
        LoanDetails loan = loanDB.findById(loanId)
            .orElseThrow(() -> new IllegalStateException("Loan not found"));
        if (!"PENDING_APPROVAL".equals(loan.getStatus())) {
            throw new IllegalStateException("Loan is not pending approval");
        }
        UserDetails user = getUser(loan.getAccountEmail());
        // Credit the loan amount to user's balance
        user.setAccountBalance(user.getAccountBalance() + Math.round(loan.getAmount()));
        userDB.save(user);
        loan.setStatus("APPROVED");
        loan.setUpdatedAt(String.valueOf(LocalDateTime.now()));
        loanDB.save(loan);
    }

    // ─── Admin Rejects Loan ───
    @Transactional
    public void rejectLoan(Long loanId) {
        LoanDetails loan = loanDB.findById(loanId)
            .orElseThrow(() -> new IllegalStateException("Loan not found"));
        loan.setStatus("REJECTED");
        loan.setUpdatedAt(String.valueOf(LocalDateTime.now()));
        loanDB.save(loan);
    }

    // ─── Get all pending loans (for admin queue) ───
    public List<LoanDetails> getPendingLoans() {
        return loanDB.findByStatus("PENDING_APPROVAL");
    }

    public List<LoanDetails> getMyLoans(String email) {
        return loanDB.findByAccountEmail(email);
    }

    private int getInterestRate(String loanType) {
        if (loanType == null) return 12;
        return switch (loanType.toUpperCase()) {
            case "HOME" -> 8;
            case "EDUCATION" -> 10;
            case "CAR" -> 9;
            case "PERSONAL" -> 14;
            default -> 12;
        };
    }
}