package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
