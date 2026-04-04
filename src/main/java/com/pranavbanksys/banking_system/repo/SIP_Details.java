package com.pranavbanksys.banking_system.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
@Entity
@Data
@Table(name = "sip_details")
@RequiredArgsConstructor
public class SIP_Details {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String accountEmail;
    private String sipType;
    private Double sipAmount;
    private Integer sipDuration; // in months
    private Double sipInterestRate;
    private Double sipMaturityAmount;
    private String sipStartDate;
    private String sipMaturityDate;
    private String sipStatus; // ACTIVE, MATURED, etc.
}