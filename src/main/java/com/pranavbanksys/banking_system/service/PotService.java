package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.PotDB;
import com.pranavbanksys.banking_system.repo.PotDetails;
import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PotService {

    private final PotDB potDB;
    private final UserDB userDB;

    public List<PotDetails> getMyPots(String email) {
        return potDB.findByAccountEmail(email);
    }

    @Transactional
    public PotDetails createPot(String email, String potName, Double targetAmount) {
        UserDetails user = userDB.findByuEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        PotDetails pot = new PotDetails();
        pot.setAccountEmail(email);
        pot.setPotName(potName);
        pot.setTargetAmount(targetAmount);
        pot.setCurrentBalance(0.0);
        pot.setCreatedAt(LocalDateTime.now().toString());

        return potDB.save(pot);
    }

    @Transactional
    public void fundPot(String email, Long potId, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        UserDetails user = userDB.findByuEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        PotDetails pot = potDB.findById(potId)
                .orElseThrow(() -> new IllegalArgumentException("Pot not found"));

        if (!pot.getAccountEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized pot access");
        }

        long balance = user.getAccountBalance() != null ? user.getAccountBalance() : 0L;
        if (balance < Math.round(amount)) {
            throw new IllegalArgumentException("Insufficient funds in main account");
        }

        // Deduct from main account
        user.setAccountBalance(balance - Math.round(amount));
        userDB.save(user);

        // Add to Pot
        pot.setCurrentBalance(pot.getCurrentBalance() + amount);
        potDB.save(pot);
    }

    @Transactional
    public void withdrawFromPot(String email, Long potId, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        UserDetails user = userDB.findByuEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        PotDetails pot = potDB.findById(potId)
                .orElseThrow(() -> new IllegalArgumentException("Pot not found"));

        if (!pot.getAccountEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized pot access");
        }

        if (pot.getCurrentBalance() < amount) {
            throw new IllegalArgumentException("Insufficient funds in pot");
        }

        // Deduct from Pot
        pot.setCurrentBalance(pot.getCurrentBalance() - amount);
        potDB.save(pot);

        // Add to main account
        long currentBalance = user.getAccountBalance() != null ? user.getAccountBalance() : 0L;
        user.setAccountBalance(currentBalance + Math.round(amount));
        userDB.save(user);
    }
}
