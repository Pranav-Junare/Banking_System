package com.pranavbanksys.banking_system.controller;

import com.pranavbanksys.banking_system.repo.AdminDetails;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminDashboard {
    @GetMapping("/adminDashboard")
    public ResponseEntity<?> adminDash(HttpSession session){
        Object ses=session.getAttribute("currentAdmin");
        if(ses==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Not logged in"));

        AdminDetails admin=(AdminDetails) ses;
        return ResponseEntity.ok(Map.of("aName",admin.getAName()));
    }
}
