package com.pranavbanksys.banking_system.service;

public interface RechargeStrategy {
    boolean executeRecharge(String mobileNumber, Double amount);
    String getProviderName();
}
