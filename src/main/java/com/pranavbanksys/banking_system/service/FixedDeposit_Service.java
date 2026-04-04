package com.pranavbanksys.banking_system.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.pranavbanksys.banking_system.repo.FixedDeposit_DB;
import com.pranavbanksys.banking_system.repo.FixedDeposit_Details;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;

@Service
@RequiredArgsConstructor
public class FixedDeposit_Service {
    
    private final FixedDeposit_DB fixedDepositDB;
    private final UserDB userDB;

    public UserDetails getUser(String email) {
        UserDetails user = userDB.findByuEmail(email);
        if (user == null || user.getUEmail() == null) {
            throw new IllegalStateException("No user found");
        }
        return user;
    }
   
@Transactional 
    public void createFixedDeposit(String accountEmail, String fdType, Double fdAmount, Integer fdDuration) {
        UserDetails user = getUser(accountEmail);

        public List<FixedDeposit_Details> getMyFDs(String email) {
        return fixedDepositDB.findByAccountEmail(email);
    }

        if (user.getAccountBalance() < fdAmount) {
            throw new IllegalStateException("Insufficient balance to create Fixed Deposit");
        }

        // Just get the flat interest rate based on the string they send
        Double interestRate = getInterestRate(fdType);
    
        FixedDeposit_Details fdDetails = new FixedDeposit_Details();
        fdDetails.setAccountEmail(accountEmail);
        fdDetails.setFdType(fdType.toUpperCase());
        fdDetails.setFdAmount(fdAmount);
        fdDetails.setFdDuration(fdDuration);
        fdDetails.setFdInterestRate(interestRate);
        
        double timeInYears = fdDuration / 12.0;
        double maturityAmount = fdAmount * Math.pow((1 + (interestRate / 100)), timeInYears);
        fdDetails.setFdMaturityAmount(maturityAmount);
        
        fdDetails.setFdStartDate(java.time.LocalDate.now().toString());
        fdDetails.setFdMaturityDate(java.time.LocalDate.now().plusMonths(fdDuration).toString());
        fdDetails.setFdStatus("ACTIVE");

        fixedDepositDB.save(fdDetails);

        user.setAccountBalance(user.getAccountBalance() - fdAmount);
        userDB.save(user);
    }

    private Double getInterestRate(String fdType) {
        if (fdType == null) return 6.0;
        
        return switch (fdType.toUpperCase()) {
            case "SENIOR_CITIZEN" -> 7.5; // Flat rate for seniors
            case "CHILDREN" -> 6.75;      // Flat rate for children
            case "REGULAR" -> 6.0;        // Standard rate
            default -> 6.0;
        };
    }
}