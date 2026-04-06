package com.pranavbanksys.banking_system.service;

import org.springframework.stereotype.Component;

@Component
public class JioStrategy implements RechargeStrategy {
    @Override
    public boolean executeRecharge(String mobileNumber, Double amount) {
        // Simulated API Handshake
        System.out.println("[JIO] Initiating JioNet Payment Bridge...");
        System.out.println("[JIO] Processing Plan Activation: " + mobileNumber + " for " + amount);
        return true;
    }

    @Override
    public String getProviderName() {
        return "JIO";
    }
}
