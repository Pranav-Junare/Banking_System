package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adminId; // Could be email or ID
    private String action; // E.g., "FREEZE_ACCOUNT", "APPROVE_KYC"
    private String targetId; // Target user or transaction ID
    private LocalDateTime timestamp;
    private String ipAddress;
}
