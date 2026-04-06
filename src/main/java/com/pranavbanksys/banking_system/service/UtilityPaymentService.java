package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.Mandate;
import com.pranavbanksys.banking_system.repo.MandateDB;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UtilityPaymentService {

    private final MandateDB mandateDB;
    private final UserDB userDB;
    private final List<RechargeStrategy> telecomStrategies;

    // --- Mock Provider Service for Bills ---
    
    public Map<String, Object> fetchBill(String billerName, String consumerId) {
        // Mock randomized bill fetch
        double mockAmount = 100 + new Random().nextInt(1500);
        return Map.of(
            "biller", billerName,
            "consumerId", consumerId,
            "amount_due", mockAmount,
            "dueDate", LocalDate.now().plusDays(10).toString(),
            "status", "UNPAID"
        );
    }

    @Transactional
    public Map<String, Object> payBill(String email, String billerName, String consumerId, Double amount) {
        UserDetails user = userDB.findByuEmail(email);
        long balance = (user != null && user.getAccountBalance() != null) ? user.getAccountBalance() : 0L;
        if (user == null || balance < Math.round(amount)) {
            throw new IllegalArgumentException("Insufficient balance to pay bill");
        }

        user.setAccountBalance(balance - Math.round(amount));
        userDB.save(user);

        // Generate JSON-based "Digital Receipt"
        return Map.of(
            "receipt_id", "REC_" + new Random().nextInt(999999),
            "paid_to", billerName,
            "consumerId", consumerId,
            "amount_paid", amount,
            "timestamp", LocalDate.now().toString(),
            "status", "SUCCESS"
        );
    }

    // --- Auto-Pay Mandate System ---

    @Transactional
    public Mandate setupMandate(String email, String billerName, String consumerId, Double amount, int executionDay) {
        if (executionDay < 1 || executionDay > 28) {
            throw new IllegalArgumentException("Execution day must be between 1 and 28");
        }

        Mandate mandate = new Mandate();
        mandate.setAccountEmail(email);
        mandate.setBillerName(billerName);
        mandate.setConsumerId(consumerId);
        mandate.setAmount(amount);
        mandate.setExecutionDayOfMonth(executionDay);
        mandate.setIsActive(true);

        return mandateDB.save(mandate);
    }

    @Scheduled(cron = "0 30 2 * * ?") // 2:30 AM Daily
    @Transactional
    public void executeDailyMandates() {
        int today = LocalDate.now().getDayOfMonth();
        List<Mandate> activeMandates = mandateDB.findByIsActiveTrue();

        for (Mandate mandate : activeMandates) {
            if (mandate.getExecutionDayOfMonth() == today) {
                // Time to execute!
                UserDetails user = userDB.findByuEmail(mandate.getAccountEmail());
                if (user != null && user.getAccountBalance() != null && user.getAccountBalance() >= Math.round(mandate.getAmount())) {
                    user.setAccountBalance(user.getAccountBalance() - Math.round(mandate.getAmount()));
                    mandate.setLastExecutionDate(LocalDate.now().toString());
                    
                    System.out.println("[AUTO-PAY] Successfully charged Rs. " + mandate.getAmount() + 
                        " from " + mandate.getAccountEmail() + " for " + mandate.getBillerName());
                    
                    userDB.save(user);
                    mandateDB.save(mandate);
                } else {
                    System.err.println("[AUTO-PAY] FAILED due to insufficient funds: " + mandate.getAccountEmail());
                }
            }
        }
    }

    // --- Mobile Recharge via Strategy ---

    @Transactional
    public Map<String, Object> rechargeMobile(String email, String providerName, String mobileNumber, Double amount) {
        UserDetails user = userDB.findByuEmail(email);
        long balance = (user != null && user.getAccountBalance() != null) ? user.getAccountBalance() : 0L;
        if (user == null || balance < Math.round(amount)) {
            throw new IllegalArgumentException("Insufficient balance to recharge");
        }

        // Find Strategy
        RechargeStrategy strategyToUse = null;
        for (RechargeStrategy t : telecomStrategies) {
            if (t.getProviderName().equalsIgnoreCase(providerName)) {
                strategyToUse = t;
                break;
            }
        }

        if (strategyToUse == null) {
            throw new IllegalArgumentException("Unsupported telecom provider: " + providerName);
        }

        // Execute Strategy Mock
        boolean success = strategyToUse.executeRecharge(mobileNumber, amount);

        if (success) {
            user.setAccountBalance(balance - Math.round(amount));
            userDB.save(user);
            return Map.of("message", "Recharge successful", "provider", providerName, "number", mobileNumber);
        } else {
            throw new RuntimeException("Provider failure");
        }
    }
}
