package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.CreditProfile;
import com.pranavbanksys.banking_system.repo.CreditProfileDB;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreditService {

    private final CreditProfileDB creditProfileDB;
    private final UserDB userDB;

    public CreditProfile getOrCreateProfile(String email) {
        Optional<CreditProfile> profileOpt = creditProfileDB.findByAccountEmail(email);
        if (profileOpt.isPresent()) {
            return profileOpt.get();
        }

        CreditProfile profile = new CreditProfile();
        profile.setAccountEmail(email);
        profile.setCreditLimit(10000.0);
        profile.setOverdraftLimit(0.0);
        profile.setPendingCreditBalance(0.0);
        profile.setStatementBalance(0.0);
        profile.setMonthlyIncome(0.0);
        profile.setMonthlyDebt(0.0);
        profile.setRepaymentHistoryScore(1.0); // Perfect start
        profile.setAccountAgeMonths(1);
        
        return creditProfileDB.save(profile);
    }

    @Transactional
    public void updateIncomeData(String email, Double income, Double debt) {
        CreditProfile profile = getOrCreateProfile(email);
        profile.setMonthlyIncome(income);
        profile.setMonthlyDebt(debt);
        creditProfileDB.save(profile);
    }

    public Double calculateDTI(String email) {
        CreditProfile profile = getOrCreateProfile(email);
        if (profile.getMonthlyIncome() <= 0) return 0.0;
        return (profile.getMonthlyDebt() / profile.getMonthlyIncome()) * 100.0;
    }

    public int calculateCreditScore(String email) {
        CreditProfile profile = getOrCreateProfile(email);

        // Score range: 300 - 900
        // Weight: Repayment (35%), Utilization (30%), Account Age (15%). The remaining 20% is baseline.
        
        int baseScore = 300;
        
        // Repayment History (Max 210 points)
        double repaymentPoints = profile.getRepaymentHistoryScore() * 210;

        // Utilization Ratio (Max 180 points)
        // Lower utilization is better. Ratio = PendingBalance / CreditLimit
        double utilizationRatio = 0.0;
        if (profile.getCreditLimit() > 0) {
            utilizationRatio = profile.getPendingCreditBalance() / profile.getCreditLimit();
        }
        double utilScore = (1.0 - Math.min(utilizationRatio, 1.0)) * 180;

        // Account Age (Max 90 points). Cap at 60 months (5 years)
        double ageScore = Math.min((profile.getAccountAgeMonths() / 60.0), 1.0) * 90;

        // Additional base to scale to 900 top
        int totalScore = (int) (baseScore + repaymentPoints + utilScore + ageScore + 120);
        return Math.min(totalScore, 900);
    }

    @Transactional
    public void setupOverdraft(String email, Double requestedOverdraftLimit) {
        // Simple mock rule: Overdraft limit can't exceed 50% of monthly income
        CreditProfile profile = getOrCreateProfile(email);
        
        if (requestedOverdraftLimit > (profile.getMonthlyIncome() * 0.5)) {
            throw new IllegalArgumentException("Requested Overdraft exceeds 50% of income limits");
        }
        
        profile.setOverdraftLimit(requestedOverdraftLimit);
        creditProfileDB.save(profile);
    }

    // --- Automated Batch Jobs ---

    // Runs every day at 1:00 AM server time (Cron: 0 0 1 * * ?)
    // For simulation, we will run it every 1 minute so user can test: "0 * * * * *"
    // I'll keep the cron for daily but comment the fast one.
    // @Scheduled(cron = "0 * * * * *") // Every minute test
    @Scheduled(cron = "0 0 1 * * ?") // Every day at 1 AM
    @Transactional
    public void calculateDailyOverdraftInterest() {
        List<UserDetails> allUsers = userDB.findAll();
        for (UserDetails user : allUsers) {
            if (user.getAccountBalance() < 0) {
                // Balance is negative, apply 0.1% daily interest penalty
                long penalty = (long) (Math.abs(user.getAccountBalance()) * 0.001);
                user.setAccountBalance(user.getAccountBalance() - penalty); // increases absolute debt
                userDB.save(user);
                System.out.println("Applied OD Interest to: " + user.getUEmail() + " | Penalty: " + penalty);
            }
        }
    }

    // Runs on 1st day of every month at 2:00 AM
    @Scheduled(cron = "0 0 2 1 * ?")
    @Transactional
    public void generateMonthlyCreditStatements() {
        List<CreditProfile> profiles = creditProfileDB.findAll();
        for (CreditProfile p : profiles) {
            if (p.getPendingCreditBalance() > 0) {
                // Move pending to statement (simulate generating a bill)
                p.setStatementBalance(p.getStatementBalance() + p.getPendingCreditBalance());
                p.setPendingCreditBalance(0.0);
                creditProfileDB.save(p);
                System.out.println("Generated Credit Statement for: " + p.getAccountEmail());
            }
        }
    }
}
