package com.pranavbanksys.banking_system.controller;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.FixedDeposit_Service;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.util.Map;
@RestController
@RequiredArgsConstructor
public class SIP {
    private final SIP_Service sipService;
    @PostMapping("/create-sip")
    public ResponseEntity<?> createSIP(@RequestBody SIPRequest request, HttpSession session)
    {
        try {
            // Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // Process the SIP creation via Service
            sipService.createSIP(
                    currentUser.getUEmail(),
                    request.getSipType(),
                    request.getSipAmount(),
                    request.getSipDuration()
            );

           // Return success message as JSON
            return ResponseEntity.ok(Map.of("message", "SIP created successfully"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-sips")
    public ResponseEntity<?> viewMySIPs(HttpSession session) {
        try {
            // Authenticate via Session
            Object ses = session.getAttribute("currentUser");
            if (ses == null) throw new IllegalStateException("Not logged in");
            UserDetails currentUser = (UserDetails) ses;

            // Fetch the user's SIPs via Service
            var mySIPs = sipService.getMySIPs(currentUser.getUEmail());

            // Return the list of SIPs as JSON
            return ResponseEntity.ok(mySIPs);

        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    // DTO for SIP creation request
    @Data
    static class SIPRequest {
        private String sipType;
        private Double sipAmount;
        private Integer sipDuration; // in months
    }
    