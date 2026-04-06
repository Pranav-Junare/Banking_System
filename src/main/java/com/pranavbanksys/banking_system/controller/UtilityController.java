package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.Mandate;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.UtilityPaymentService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/utility")
@RequiredArgsConstructor
public class UtilityController {

    private final UtilityPaymentService utilityService;

    private String getEmailFromSession(HttpSession session) {
        UserDetails currentUser = (UserDetails) session.getAttribute("currentUser");
        if (currentUser != null) {
            return currentUser.getUEmail();
        }
        return null;
    }

    @PostMapping("/fetch-bill")
    public ResponseEntity<?> fetchBill(@RequestBody FetchBillRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        Map<String, Object> billData = utilityService.fetchBill(request.getBillerName(), request.getConsumerId());
        return ResponseEntity.ok(billData);
    }

    @PostMapping("/pay-bill")
    public ResponseEntity<?> payBill(@RequestBody PayBillRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            Map<String, Object> receipt = utilityService.payBill(email, request.getBillerName(), request.getConsumerId(), request.getAmount());
            return ResponseEntity.ok(receipt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/setup-mandate")
    public ResponseEntity<?> setupMandate(@RequestBody MandateRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            Mandate mandate = utilityService.setupMandate(email, request.getBillerName(), request.getConsumerId(), request.getAmount(), request.getExecutionDay());
            return ResponseEntity.ok(Map.of("message", "Auto-pay setup successful", "mandate_id", mandate.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/recharge-mobile")
    public ResponseEntity<?> rechargeMobile(@RequestBody RechargeRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            Map<String, Object> receipt = utilityService.rechargeMobile(email, request.getProviderName(), request.getMobileNumber(), request.getAmount());
            return ResponseEntity.ok(receipt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

// Request Objects
@Data
class FetchBillRequest {
    private String billerName;
    private String consumerId;
}

@Data
class PayBillRequest {
    private String billerName;
    private String consumerId;
    private Double amount;
}

@Data
class MandateRequest {
    private String billerName;
    private String consumerId;
    private Double amount;
    private Integer executionDay;
}

@Data
class RechargeRequest {
    private String providerName; // "AIRTEL", "JIO"
    private String mobileNumber;
    private Double amount;
}
