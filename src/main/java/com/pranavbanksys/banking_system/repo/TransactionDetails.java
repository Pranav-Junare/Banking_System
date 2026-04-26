package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetails {
    @Id
    @Column(unique = true,nullable = false,length=15)
    private String transactionID;

    private String fromUser;
    private String toUser;
    private Long amount;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    private com.pranavbanksys.banking_system.enums.TransactionStatus status = com.pranavbanksys.banking_system.enums.TransactionStatus.CLEARED;

    private String flaggedReason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime transactionDateTime;

}
