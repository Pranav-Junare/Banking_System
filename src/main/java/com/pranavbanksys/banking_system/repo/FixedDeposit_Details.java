package com.pranavbanksys.banking_system.repo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FixedDeposit_Details {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fdID;

    private String fdType;
    private Double fdAmount;
    private Integer fdDuration; // in months
    private Double fdInterestRate;
    private Double fdMaturityAmount;
    private String accountEmail; // To link the FD to a user's email
    private String fdStartDate; // To track when the FD was created
    private String fdMaturityDate; // To track when the FD will mature
    private String fdStatus; // ACTIVE, MATURED, CLOSED
}