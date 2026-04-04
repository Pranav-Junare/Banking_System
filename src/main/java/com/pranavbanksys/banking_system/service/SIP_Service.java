package com.pranavbanksys.banking_system.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.pranavbanksys.banking_system.repo.SIP_DB;
import com.pranavbanksys.banking_system.repo.SIP_Details;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;

@Service
@RequiredArgsConstructor
public class SIP_Service {

    private final SIP_DB sipDB;
    private final UserDB userDB;

    public UserDetails getUser(String email) {
        // check if the user exists or not before creating SIP
        UserDetails user = userDB.findByuEmail(email);
        if (user == null || user.getUEmail() == null) {
            throw new IllegalStateException("No user found");
        }
        return user;
    }

    // fetch sip for specific user
    public List<SIP_Details> getMySIPs(String email) {
        return sipDB.findByAccountEmail(email);
    }

    @Transactional
    public void createSIP(String accountEmail, String sipType, Double sipAmount, Integer sipDuration) {
        UserDetails user = getUser(accountEmail);

        // Check if the user has sufficient balance to create the SIP
        if (user.getAccountBalance() < sipAmount) {
            throw new IllegalStateException("Insufficient balance to create SIP");
        }

        // Just get the flat interest rate based on the string they send
        Double interestRate = getInterestRate(sipType);

        SIP_Details sipDetails = new SIP_Details();
        sipDetails.setAccountEmail(accountEmail);
        sipDetails.setSipType(sipType.toUpperCase());
        sipDetails.setSipAmount(sipAmount);
        sipDetails.setSipDuration(sipDuration);
        sipDetails.setSipInterestRate(interestRate);

        // Calculate maturity amount
        double timeInYears = sipDuration / 12.0;
        double maturityAmount = sipAmount * Math.pow((1 + (interestRate / 100)), timeInYears);
        sipDetails.setSipMaturityAmount(maturityAmount);

        // Set the start date as current date and maturity date based on the duration
        sipDetails.setSipStartDate(java.time.LocalDate.now().toString());
        sipDetails.setSipMaturityDate(java.time.LocalDate.now().plusMonths(sipDuration).toString());
        sipDetails.setSipStatus("ACTIVE");

        sipDB.save(sipDetails);

        // FIXED: Removed the weird (long) cast and SAVED the user to the DB
        user.setAccountBalance((long) (user.getAccountBalance() - sipAmount));
        userDB.save(user); // THIS WAS MISSING
    }

    private Double getInterestRate(String sipType) {
        // interest rate according to the type of SIP
        return switch (sipType.toUpperCase()) {
            case "EQUITY" -> 12.0;
            case "MUTUAL_FUND" -> 10.0; // Strongly recommend using underscore for Postman testing
            default -> throw new IllegalArgumentException("Invalid SIP type");
        };
    }
}