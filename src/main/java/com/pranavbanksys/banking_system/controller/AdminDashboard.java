package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.enums.AccountStatus;
import com.pranavbanksys.banking_system.repo.*;
import com.pranavbanksys.banking_system.service.LoanService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminDashboard {
    private final FixedDeposit_DB fixedDepositDb;
    private final SIP_DB sipDb;
    private final LoanDB loanDb;
    private final VirtualCardDB virtualCardDb;
    private final PotDB potDb;
    private final SupportTicketDB supportTicketDb;
    private final LoanService loanService;
    private final UserDB userDb;
    private final TransactionDB transactionDb;

    @GetMapping("/adminDashboard")
    public ResponseEntity<?> adminDash(HttpSession session){
        Object ses=session.getAttribute("currentAdmin");
        if(ses==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Not logged in"));
        AdminDetails admin=(AdminDetails) ses;
        return ResponseEntity.ok(Map.of("aName",admin.getAName()));
    }

    // ─── ADMIN PORTFOLIO VIEW ──────────────────────────────────────
    @GetMapping("/api/admin/user/{email}/portfolio")
    public ResponseEntity<?> getUserPortfolio(@PathVariable String email, HttpSession session) {
        Map<String, Object> portfolio = new HashMap<>();
        portfolio.put("fds", fixedDepositDb.findByAccountEmail(email));
        portfolio.put("sips", sipDb.findByAccountEmail(email));
        portfolio.put("loans", loanDb.findByAccountEmail(email));
        portfolio.put("cards", virtualCardDb.findByAccountEmail(email));
        portfolio.put("pots", potDb.findByAccountEmail(email));
        return ResponseEntity.ok(portfolio);
    }

    // ─── ADMIN SUPPORT TICKETS ──────────────────────────────────────
    @GetMapping("/api/admin/tickets")
    public ResponseEntity<?> getOpenTickets(HttpSession session) {
        return ResponseEntity.ok(supportTicketDb.findByStatus("OPEN"));
    }

    @PostMapping("/api/admin/tickets/{id}/resolve")
    public ResponseEntity<?> resolveTicket(@PathVariable Long id, @RequestBody ResolveTicketRequest req, HttpSession session) {
        SupportTicket ticket = supportTicketDb.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.badRequest().body(Map.of("error", "Ticket not found"));

        // If this is a card unfreeze approval, reactivate the card
        if ("APPROVED".equals(req.getStatus()) && "CARD_UNFREEZE".equals(ticket.getTicketType())) {
            Long cardId = Long.parseLong(ticket.getTargetId());
            VirtualCard card = virtualCardDb.findById(cardId).orElse(null);
            if (card != null) {
                card.setIsActive(true);
                virtualCardDb.save(card);
            }
        }

        // If this is a transaction dispute approval, reverse the transaction
        if ("APPROVED".equals(req.getStatus()) && "DISPUTE".equals(ticket.getTicketType())) {
            String txnId = ticket.getTargetId();
            TransactionDetails txn = transactionDb.findById(txnId).orElse(null);
            if (txn != null && txn.getStatus() == com.pranavbanksys.banking_system.enums.TransactionStatus.CLEARED) {
                // Refund sender
                UserDetails sender = userDb.findByuEmail(txn.getFromUser());
                UserDetails receiver = userDb.findByuEmail(txn.getToUser());
                if (sender != null) {
                    sender.setAccountBalance(sender.getAccountBalance() + txn.getAmount());
                    userDb.save(sender);
                }
                if (receiver != null && receiver.getAccountBalance() >= txn.getAmount()) {
                    receiver.setAccountBalance(receiver.getAccountBalance() - txn.getAmount());
                    userDb.save(receiver);
                }
                txn.setStatus(com.pranavbanksys.banking_system.enums.TransactionStatus.REVERSED);
                txn.setFlaggedReason("DISPUTE_APPROVED: " + ticket.getDescription());
                transactionDb.save(txn);
            }
        }

        ticket.setStatus(req.getStatus());
        supportTicketDb.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket resolved successfully"));
    }

    // ─── LOAN UNDERWRITING QUEUE ──────────────────────────────────────
    @GetMapping("/api/admin/loans/pending")
    public ResponseEntity<?> getPendingLoans(HttpSession session) {
        return ResponseEntity.ok(loanService.getPendingLoans());
    }

    @PostMapping("/api/admin/loans/{id}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable Long id, HttpSession session) {
        try {
            loanService.approveLoan(id);
            return ResponseEntity.ok(Map.of("message", "Loan approved and funds disbursed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/admin/loans/{id}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable Long id, HttpSession session) {
        try {
            loanService.rejectLoan(id);
            return ResponseEntity.ok(Map.of("message", "Loan rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── ADMIN ACCOUNT SUSPENSION ──────────────────────────────────────
    @PostMapping("/api/admin/user/{email}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable String email, HttpSession session) {
        UserDetails user = userDb.findByuEmail(email);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        user.setAccountStatus(AccountStatus.SUSPENDED);
        userDb.save(user);
        return ResponseEntity.ok(Map.of("message", "Account suspended"));
    }

    @PostMapping("/api/admin/user/{email}/unsuspend")
    public ResponseEntity<?> unsuspendUser(@PathVariable String email, HttpSession session) {
        UserDetails user = userDb.findByuEmail(email);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        user.setAccountStatus(AccountStatus.ACTIVE);
        userDb.save(user);
        return ResponseEntity.ok(Map.of("message", "Account reactivated"));
    }

    // ─── ALL USERS LIST (for admin management) ──────────────────────────
    @GetMapping("/api/admin/users")
    public ResponseEntity<?> getAllUsers(HttpSession session) {
        List<UserDetails> users = userDb.findAll();
        // Map to a safe format (exclude passwords)
        var result = users.stream().map(u -> Map.of(
            "uid", u.getUID(),
            "name", u.getUName(),
            "email", u.getUEmail(),
            "balance", u.getAccountBalance(),
            "status", u.getAccountStatus().name(),
            "tier", u.getAccountTier().name(),
            "kycStatus", u.getKycStatus().name()
        )).toList();
        return ResponseEntity.ok(result);
    }

    // ─── STATEMENT DOWNLOAD ──────────────────────────────────────
    @GetMapping("/api/user/statement/download")
    public ResponseEntity<?> downloadStatement(HttpSession session) {
        Object ses = session.getAttribute("currentUser");
        if (ses == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        UserDetails user = (UserDetails) ses;
        String email = user.getUEmail();

        List<TransactionDetails> txns = transactionDb.findByFromUser(email);
        StringBuilder sb = new StringBuilder();
        sb.append("========================================\n");
        sb.append("       PRANAVBANK ACCOUNT STATEMENT     \n");
        sb.append("========================================\n");
        sb.append("Account Holder: ").append(user.getUName()).append("\n");
        sb.append("Email: ").append(email).append("\n");
        sb.append("Current Balance: ₹").append(user.getAccountBalance()).append("\n");
        sb.append("----------------------------------------\n");
        sb.append(String.format("%-15s %-25s %-10s %-10s\n", "TXN ID", "TO", "AMOUNT", "STATUS"));
        sb.append("----------------------------------------\n");
        for (TransactionDetails t : txns) {
            sb.append(String.format("%-15s %-25s ₹%-9d %-10s\n",
                t.getTransactionID(), t.getToUser(), t.getAmount(), t.getStatus()));
        }
        sb.append("----------------------------------------\n");
        sb.append("Generated: ").append(LocalDateTime.now()).append("\n");
        sb.append("========================================\n");

        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=statement.txt")
            .header("Content-Type", "text/plain")
            .body(sb.toString());
    }
}

@Data
class ResolveTicketRequest {
    private String status; // APPROVED (RESOLVED), REJECTED
}
