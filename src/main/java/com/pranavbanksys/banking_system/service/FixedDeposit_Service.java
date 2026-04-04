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
        // This method is just to fetch the user details based on email, and also to check if the user exists or not before creating FD
        UserDetails user = userDB.findByuEmail(email);
        if (user == null || user.getUEmail() == null) {
            throw new IllegalStateException("No user found");
        }
        return user;
    }
    // This method is to fetch all the FDs for a specific user based on their email, which will be used in the controller to show the user their FDs
    public List<FixedDeposit_Details> getMyFDs(String email) {
        return fixedDepositDB.findByAccountEmail(email);
    }

    @Transactional
    public void createFixedDeposit(String accountEmail, String fdType, Double fdAmount, Integer fdDuration) {
        UserDetails user = getUser(accountEmail);

        // Check if the user has sufficient balance to create the FD
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
        // Calculate maturity amount using compound interest formula: A = P(1 + r/n)^(nt)
        double timeInYears = fdDuration / 12.0;
        double maturityAmount = fdAmount * Math.pow((1 + (interestRate / 100)), timeInYears);
        fdDetails.setFdMaturityAmount(maturityAmount);
        // Set the start date as current date and maturity date based on the duration
        fdDetails.setFdStartDate(java.time.LocalDate.now().toString());
        fdDetails.setFdMaturityDate(java.time.LocalDate.now().plusMonths(fdDuration).toString());
        fdDetails.setFdStatus("ACTIVE");

        fixedDepositDB.save(fdDetails);

        user.setAccountBalance((long) (user.getAccountBalance() - fdAmount));
        userDB.save(user);
    }
    // This method is to determine the interest rate based on the type of FD, and it can be easily extended in the future if we want to add more types of FDs with different rates
    private Double getInterestRate(String fdType) {
        // Default interest rate if fdType is null or doesn't match any case
        if (fdType == null) return 6.0;
        // Using switch expression to determine the interest rate based on fdType, and converting it to uppercase to make it case-insensitive
        return switch (fdType.toUpperCase()) {
            case "SENIOR_CITIZEN" -> 7.5; // Flat rate for seniors
            case "CHILDREN" -> 6.75;      // Flat rate for children
            case "REGULAR" -> 6.0;        // Standard rate
            default -> 6.0;
        };
    }
}