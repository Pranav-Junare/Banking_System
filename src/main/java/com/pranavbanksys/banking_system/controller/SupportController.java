package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.*;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {
    private final SupportTicketDB supportTicketDB;

    private String getEmailFromSession(HttpSession session) {
        UserDetails currentUser = (UserDetails) session.getAttribute("currentUser");
        if (currentUser != null) {
            return currentUser.getUEmail();
        }
        return null;
    }

    @PostMapping("/ticket")
    public ResponseEntity<?> createTicket(@RequestBody TicketRequest req, HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        SupportTicket ticket = new SupportTicket();
        ticket.setUserEmail(email);
        ticket.setTicketType(req.getTicketType());
        ticket.setTargetId(req.getTargetId());
        ticket.setDescription(req.getDescription());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now().toString());
        
        supportTicketDB.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Support ticket created"));
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(HttpSession session) {
        String email = getEmailFromSession(session);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(supportTicketDB.findByUserEmail(email));
    }
}

@Data
class TicketRequest {
    private String ticketType;
    private String targetId;
    private String description;
}
