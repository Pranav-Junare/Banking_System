package com.pranavbanksys.banking_system.service;

import org.springframework.stereotype.Component;

@Component
public class AirtelStrategy implements RechargeStrategy {
    @Override
    public boolean executeRecharge(String mobileNumber, Double amount) {
        // Simulated API Handshake
        System.out.println("[AIRTEL] Connecting to Airtel gateways...");
        System.out.println("[AIRTEL] Recharge of Rs. " + amount + " successful on " + mobileNumber);
        return true;
    }

    @Override
    public String getProviderName() {
        return "AIRTEL";
    }
}
