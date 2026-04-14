package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.KycRequest;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.KycService;
import com.pranavbanksys.banking_system.service.KycSubmissionDto;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    // Helper for auth
    private String getEmailFromSession(HttpSession session) {
        Object ses = session.getAttribute("currentUser");
        if (ses instanceof UserDetails) {
            return ((UserDetails) ses).getUEmail();
        }
        return null; // Could also check currentAdmin but for demo, basic check is fine
    }

    /* --- USER ENDPOINTS --- */
    @PostMapping("/submit")
    public ResponseEntity<?> submitKyc(@RequestBody KycSubmissionDto request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            KycRequest submitted = kycService.submitKyc(email, request);
            return ResponseEntity.ok(Map.of("message", "KYC submitted successfully", "request", submitted));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getKycStatus(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            String status = kycService.getKycStatus(email);
            return ResponseEntity.ok(Map.of("status", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /* --- ADMIN ENDPOINTS --- */
    @GetMapping("/queue")
    public ResponseEntity<?> getPendingKycQueue(HttpSession session) {
        try {
            List<KycRequest> queue = kycService.getPendingQueue();
            return ResponseEntity.ok(queue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/review")
    public ResponseEntity<?> reviewKyc(@RequestBody KycReviewRequest request, HttpSession session) {
        try {
            kycService.reviewKyc(request.getRequestId(), request.getStatus());  
            return ResponseEntity.ok(Map.of("message", "KYC status updated"));  
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

@Data
class KycReviewRequest {
    private Long requestId;
    private String status; // APPROVED or REJECTED
}
