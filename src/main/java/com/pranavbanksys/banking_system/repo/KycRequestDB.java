package com.pranavbanksys.banking_system.repo;

import com.pranavbanksys.banking_system.enums.KycStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KycRequestDB extends JpaRepository<KycRequest, Long> {
    List<KycRequest> findByUserEmail(String userEmail);
    List<KycRequest> findByStatus(KycStatus status);
}
