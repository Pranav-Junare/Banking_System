package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.enums.KycStatus;
import com.pranavbanksys.banking_system.repo.KycRequest;
import com.pranavbanksys.banking_system.repo.KycRequestDB;
import com.pranavbanksys.banking_system.repo.UserDetails;
import com.pranavbanksys.banking_system.repo.UserDB;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycRequestDB kycRequestDB;
    private final UserDB userDB;

    public KycRequest submitKyc(String email, KycSubmissionDto requestDto) {
        UserDetails user = userDB.findByuEmail(email);
        if (user == null) throw new IllegalStateException("User not found");    

        if (user.getKycStatus() == KycStatus.APPROVED) {
            throw new IllegalStateException("KYC is already approved.");        
        }

        // Update user status to PENDING
        user.setKycStatus(KycStatus.PENDING);
        userDB.save(user);

        // Delete any existing requests
        List<KycRequest> existingReqs = kycRequestDB.findByUserEmail(email);    
        kycRequestDB.deleteAll(existingReqs);

        // Create new request
        KycRequest request = new KycRequest();
        request.setUserEmail(email);
        request.setLegalName(requestDto.getLegalName());
        request.setDob(requestDto.getDob());
        request.setGender(requestDto.getGender());
        request.setDocumentType(requestDto.getDocumentType());
        request.setDocumentNumber(requestDto.getDocumentNumber());
        request.setStreetAddress(requestDto.getStreetAddress());
        request.setCity(requestDto.getCity());
        request.setState(requestDto.getState());
        request.setPinCode(requestDto.getPinCode());
        request.setSameAddress(requestDto.getSameAddress());
        request.setEmploymentStatus(requestDto.getEmploymentStatus());
        request.setAnnualIncome(requestDto.getAnnualIncome());
        
        request.setStatus(KycStatus.PENDING);

        return kycRequestDB.save(request);
    }

    public String getKycStatus(String email) {
        UserDetails user = userDB.findByuEmail(email);
        if (user == null) throw new IllegalStateException("User not found");    
        return user.getKycStatus().name();
    }

    public List<KycRequest> getPendingQueue() {
        return kycRequestDB.findByStatus(KycStatus.PENDING);
    }

    public void reviewKyc(Long requestId, String statusString) {
        KycRequest request = kycRequestDB.findById(requestId)
            .orElseThrow(() -> new IllegalStateException("Request not found")); 

        KycStatus newStatus = KycStatus.valueOf(statusString);
        request.setStatus(newStatus);
        kycRequestDB.save(request);

        // Sync with UserDetails
        UserDetails user = userDB.findByuEmail(request.getUserEmail());
        if (user == null) throw new IllegalStateException("User not found");    

        user.setKycStatus(newStatus);
        userDB.save(user);
    }
}
