package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.repo.VirtualCard;
import com.pranavbanksys.banking_system.service.VirtualCardService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class VirtualCardController {

    private final VirtualCardService virtualCardService;

    private String getEmailFromSession(HttpSession session) {
        UserDetails currentUser = (UserDetails) session.getAttribute("currentUser");
        if (currentUser != null) {
            return currentUser.getUEmail();
        }
        return null;
    }

    @GetMapping("/my-cards")
    public ResponseEntity<?> getMyCards(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        
        List<VirtualCard> cards = virtualCardService.getMyCards(email);
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateCard(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            VirtualCard newCard = virtualCardService.generateCard(email);
            return ResponseEntity.ok(newCard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/freeze")
    public ResponseEntity<?> freezeCard(@RequestBody CardStatusRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            virtualCardService.toggleCardStatus(email, request.getCardId(), false);
            return ResponseEntity.ok(Map.of("message", "Card Frozen"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/activate")
    public ResponseEntity<?> activateCard(@RequestBody CardStatusRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            virtualCardService.toggleCardStatus(email, request.getCardId(), true);
            return ResponseEntity.ok(Map.of("message", "Card Activated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- PIN Management ---
    @PostMapping("/reset-pin/request")
    public ResponseEntity<?> requestPinReset(@RequestBody PinResetRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            String otp = virtualCardService.requestPinResetOtp(email, request.getCardId());
            return ResponseEntity.ok(Map.of("message", "OTP sent via email/SMS (Check console output)", "otp_for_testing", otp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-pin/confirm")
    public ResponseEntity<?> confirmPinReset(@RequestBody PinConfirmRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            virtualCardService.confirmPinReset(email, request.getCardId(), request.getOtp(), request.getNewPin());
            return ResponseEntity.ok(Map.of("message", "PIN updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/set-daily-limit")
    public ResponseEntity<?> setDailyLimit(@RequestBody DailyLimitRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            virtualCardService.updateDailyLimit(email, request.getCardId(), request.getDailyLimit());
            return ResponseEntity.ok(Map.of("message", "Daily limit updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Mock External Merchant Payment via Card ---
    @PostMapping("/transaction")
    public ResponseEntity<?> processTransaction(@RequestBody CardTransactionRequest request) {
        // Normally NO session check here, as this would come from a payment gateway, not the user session
        try {
            virtualCardService.processTransaction(request.getPan(), request.getAmount());
            return ResponseEntity.ok(Map.of("message", "Transaction Successful", "status", "APPROVED"));
        } catch (Exception e) {
            // Returns specific error (e.g., CardFrozenException, LimitExceededException, etc)
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage(), "status", "DECLINED"));
        }
    }
}

// Request DTOs
@Data
class CardStatusRequest {
    private Long cardId;
}

@Data
class PinResetRequest {
    private Long cardId;
}

@Data
class PinConfirmRequest {
    private Long cardId;
    private String otp;
    private String newPin;
}

@Data
class DailyLimitRequest {
    private Long cardId;
    private Double dailyLimit;
}

@Data
class CardTransactionRequest {
    private String pan;
    private Double amount;
}
