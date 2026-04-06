package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.UserDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.repo.VirtualCard;
import com.pranavbanksys.banking_system.repo.VirtualCardDB;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class VirtualCardService {

    private final VirtualCardDB virtualCardDB;
    private final UserDB userDB;

    // Temporary store for OTPs (Mock)
    private final Map<String, String> otpStore = new HashMap<>();

    public List<VirtualCard> getMyCards(String email) {
        return virtualCardDB.findByAccountEmail(email);
    }

    @Transactional
    public VirtualCard generateCard(String email) {
        UserDetails user = userDB.findByuEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        VirtualCard card = new VirtualCard();
        card.setAccountEmail(email);
        card.setPan(generateValidLuhnPAN());
        card.setCvv(generateCVV());
        card.setExpiryDate(generateExpiry());
        card.setIsActive(true);
        card.setDailyLimit(50000.0); // Default limit
        card.setCurrentDaySpent(0.0);
        card.setLastSpentDate(LocalDate.now().toString());
        card.setCreationDate(LocalDate.now().toString());
        
        return virtualCardDB.save(card);
    }

    @Transactional
    public void toggleCardStatus(String email, Long cardId, boolean activeStatus) {
        VirtualCard card = virtualCardDB.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));

        if (!card.getAccountEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized");
        }

        card.setIsActive(activeStatus);
        virtualCardDB.save(card);
    }

    // --- OTP & PIN Management ---

    public String requestPinResetOtp(String email, Long cardId) {
        VirtualCard card = virtualCardDB.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));
        if (!card.getAccountEmail().equals(email)) {
            throw new IllegalArgumentException("Unauthorized");
        }

        // Mock OTP generation
        String otp = String.format("%06d", new Random().nextInt(1000000));
        otpStore.put(email + "_" + cardId, otp);
        
        // In real life, we would send an SMS/Email here. For simulation, we return/print it.
        System.out.println("OTP for card PIN reset (Email: " + email + ") is: " + otp);
        return otp;
    }

    @Transactional
    public void confirmPinReset(String email, Long cardId, String otp, String newPin) {
        String expectedOtp = otpStore.get(email + "_" + cardId);
        if (expectedOtp == null || !expectedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        if (newPin == null || newPin.length() != 4 || !newPin.matches("\\d+")) {
            throw new IllegalArgumentException("PIN must be 4 digits");
        }

        VirtualCard card = virtualCardDB.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Card not found"));

        // Hash Pin securely using SHA-256 (acting as mock for BCrypt)
        card.setHashedPin(hashPin(newPin));
        virtualCardDB.save(card);

        // Consume OTP
        otpStore.remove(email + "_" + cardId);
    }

    // --- Transaction Validator ---
    
    @Transactional
    public void processTransaction(String pan, Double amount) {
        VirtualCard card = virtualCardDB.findByPan(pan)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Card"));

        if (!card.getIsActive()) {
            throw new RuntimeException("CardFrozenException: Your card is temporarily locked.");
        }

        String today = LocalDate.now().toString();

        if (card.getLastSpentDate() == null || !card.getLastSpentDate().equals(today)) {
            card.setCurrentDaySpent(0.0);
            card.setLastSpentDate(today);
        }

        if (card.getCurrentDaySpent() + amount > card.getDailyLimit()) {
            throw new RuntimeException("LimitExceededException: Daily transaction limit exceeded.");
        }

        // Proceed to logic: Fetch User, Deduct Main Account Balance natively
        UserDetails user = userDB.findByuEmail(card.getAccountEmail());
        long balance = (user.getAccountBalance() != null) ? user.getAccountBalance() : 0L;
        if (balance < Math.round(amount)) {
            throw new IllegalArgumentException("Insufficient funds in account.");
        }

        // Update balances and limits
        user.setAccountBalance(balance - Math.round(amount));
        card.setCurrentDaySpent(card.getCurrentDaySpent() + amount);
        
        userDB.save(user);
        virtualCardDB.save(card);
    }

    // --- Utilities ---

    private String generateValidLuhnPAN() {
        Random rnd = new Random();
        int[] digits = new int[16];
        digits[0] = 4; // Visa prefix (mock)
        for (int i = 1; i < 15; i++) {
            digits[i] = rnd.nextInt(10);
        }
        
        // Calculate the check digit using the Luhn algorithm.
        // We process the first 15 digits (indices 0-14). The check digit goes at index 15.
        // Luhn doubles every second digit from the RIGHT of the full 16-digit number.
        // In a 16-digit number, position 0 (leftmost) is an odd position from the right,
        // so we double digits at even indices (0, 2, 4, ..., 14) among the first 15 digits.
        int luhnSum = 0;
        for (int i = 0; i < 15; i++) {
            int currentDigit = digits[i];
            // Positions from right in 16-digit PAN: index 0 is pos 16 (even from right = not doubled)
            // Actually: for the payload (first 15 digits), index i corresponds to position (15-i) from the check digit.
            // We double every other digit starting from the rightmost payload digit.
            // The rightmost payload digit is index 14, which should be doubled.
            // So we double when (14 - i) is even, i.e., when i is even.
            if (i % 2 == 0) {
                currentDigit *= 2;
                if (currentDigit > 9) currentDigit -= 9;
            }
            luhnSum += currentDigit;
        }

        digits[15] = (10 - (luhnSum % 10)) % 10;
        
        StringBuilder sb = new StringBuilder();
        for (int d : digits) sb.append(d);
        return sb.toString();
    }

    private String generateCVV() {
        return String.format("%03d", new Random().nextInt(1000));
    }

    private String generateExpiry() {
        LocalDate expiry = LocalDate.now().plusYears(5);
        return expiry.format(DateTimeFormatter.ofPattern("MM/yy"));
    }

    private String hashPin(String pin) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(pin.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
