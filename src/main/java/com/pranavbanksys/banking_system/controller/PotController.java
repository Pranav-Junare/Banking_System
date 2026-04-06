package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.PotDetails;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.PotService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pots")
@RequiredArgsConstructor
public class PotController {

    private final PotService potService;

    private String getEmailFromSession(HttpSession session) {
        UserDetails currentUser = (UserDetails) session.getAttribute("currentUser");
        if (currentUser != null) {
            return currentUser.getUEmail();
        }
        return null;
    }

    @GetMapping("/my-pots")
    public ResponseEntity<?> getMyPots(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        List<PotDetails> pots = potService.getMyPots(email);
        return ResponseEntity.ok(pots);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPot(@RequestBody CreatePotRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        try {
            PotDetails pot = potService.createPot(email, request.getPotName(), request.getTargetAmount());
            return ResponseEntity.ok(Map.of("message", "Pot created successfully", "potId", pot.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/fund")
    public ResponseEntity<?> fundPot(@RequestBody FundPotRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        try {
            potService.fundPot(email, request.getPotId(), request.getAmount());
            return ResponseEntity.ok(Map.of("message", "Pot funded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawFromPot(@RequestBody FundPotRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        try {
            potService.withdrawFromPot(email, request.getPotId(), request.getAmount());
            return ResponseEntity.ok(Map.of("message", "Withdrawn successfully from pot"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

@Data
class CreatePotRequest {
    private String potName;
    private Double targetAmount;
}

@Data
class FundPotRequest {
    private Long potId;
    private Double amount;
}
