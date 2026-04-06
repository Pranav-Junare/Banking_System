package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.CreditProfile;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.CreditService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/credit")
@RequiredArgsConstructor
public class CreditController {

    private final CreditService creditService;

    private String getEmailFromSession(HttpSession session) {
        UserDetails currentUser = (UserDetails) session.getAttribute("currentUser");
        if (currentUser != null) {
            return currentUser.getUEmail();
        }
        return null;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCreditProfile(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        CreditProfile profile = creditService.getOrCreateProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/update-income")
    public ResponseEntity<?> updateIncomeData(@RequestBody IncomeDataRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            creditService.updateIncomeData(email, request.getMonthlyIncome(), request.getMonthlyDebt());
            return ResponseEntity.ok(Map.of("message", "Income explicitly updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/dti-score")
    public ResponseEntity<?> getDTIScore(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        double dti = creditService.calculateDTI(email);
        return ResponseEntity.ok(Map.of("dti_ratio_percentage", dti));
    }

    @GetMapping("/credit-score")
    public ResponseEntity<?> getCreditScore(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        int score = creditService.calculateCreditScore(email);
        return ResponseEntity.ok(Map.of("credit_score", score, "max_score", 900));
    }

    @PostMapping("/apply-overdraft")
    public ResponseEntity<?> applyForOverdraft(@RequestBody OverdraftRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            creditService.setupOverdraft(email, request.getRequestedOverdraftLimit());
            return ResponseEntity.ok(Map.of("message", "Overdraft protection active"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

@Data
class IncomeDataRequest {
    private Double monthlyIncome;
    private Double monthlyDebt;
}

@Data
class OverdraftRequest {
    private Double requestedOverdraftLimit;
}
