package com.pranavbanksys.banking_system.service;

import lombok.Data;

@Data
public class KycSubmissionDto {
    private String legalName;
    private String dob;
    private String gender;
    private String documentType;
    private String documentNumber;
    private String streetAddress;
    private String city;
    private String state;
    private String pinCode;
    private Boolean sameAddress;
    private String employmentStatus;
    private String annualIncome;
}
