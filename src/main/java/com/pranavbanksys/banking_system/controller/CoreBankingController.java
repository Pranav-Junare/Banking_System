package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.BankServiceRequest;
import com.pranavbanksys.banking_system.repo.CurrencyWallet;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.service.CoreBankingService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/core")
@RequiredArgsConstructor
public class CoreBankingController {

    private final CoreBankingService coreBankingService;

    private String getEmailFromSession(HttpSession session) {
        UserDetails currentUser = (UserDetails) session.getAttribute("currentUser");
        if (currentUser != null) {
            return currentUser.getUEmail();
        }
        return null;
    }

    // --- Statement Generation Resource ---
    @GetMapping(value = "/statement", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<?> downloadStatement(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        String csvData = coreBankingService.generateStatementCSV(email);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statement.csv");

        return ResponseEntity.ok()
            .headers(headers)
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csvData);
    }

    // --- Forex Endpoint ---
    @GetMapping("/forex/my-wallet")
    public ResponseEntity<?> getForexWallet(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        
        try {
            CurrencyWallet wallet = coreBankingService.getMyWallet(email);
            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forex/convert")
    public ResponseEntity<?> convertCurrency(@RequestBody ForexConvertRequest request, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            CurrencyWallet updatedWallet = coreBankingService.convertCurrency(email, request.getAmountInr(), request.getTargetCurrency());
            return ResponseEntity.ok(Map.of("message", "Conversion successful", "wallet", updatedWallet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Service Requests Endpoints ---
    @GetMapping("/service-requests")
    public ResponseEntity<?> getMyRequests(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        
        List<BankServiceRequest> requests = coreBankingService.getMyRequests(email);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/service-requests/create")
    public ResponseEntity<?> createServiceRequest(@RequestBody CreateServiceRequest req, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));

        try {
            BankServiceRequest created = coreBankingService.generateServiceRequest(email, req.getRequestType());
            return ResponseEntity.ok(Map.of("message", "Service request logged successfully", "request", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Internal admin testing endpoint
    @PostMapping("/service-requests/update-status")
    public ResponseEntity<?> updateServiceRequestStatus(@RequestBody UpdateServiceRequest req) {
        try {
            BankServiceRequest updated = coreBankingService.updateRequestStatus(req.getRequestId(), req.getNewStatus());
            return ResponseEntity.ok(Map.of("message", "Status updated successfully", "request", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

// DTOs
@Data
class ForexConvertRequest {
    private Double amountInr;
    private String targetCurrency; // "USD", "EUR", "GBP"
}

@Data
class CreateServiceRequest {
    private String requestType; // "CHEQUEBOOK", etc.
}

@Data
class UpdateServiceRequest {
    private Long requestId;
    private String newStatus; // "PROCESSING", "DISPATCHED"
}
