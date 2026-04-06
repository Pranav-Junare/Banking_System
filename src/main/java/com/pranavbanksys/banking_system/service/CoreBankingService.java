package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoreBankingService {

    private final UserDB userDB;
    private final TransactionDB transactionDB;
    private final CurrencyWalletDB currencyWalletDB;
    private final BankServiceRequestDB bankServiceRequestDB;

    // Static Mock Multiplier Matrix
    // Note: Assuming base balance is INR.
    private static final double INR_TO_USD = 0.012;
    private static final double INR_TO_EUR = 0.011;
    private static final double INR_TO_GBP = 0.0094;

    // --- Statement Generation ---
    public String generateStatementCSV(String email) {
        List<TransactionDetails> transactions = transactionDB.findByFromUser(email);

        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("TransactionID,FromUser,ToUser,Amount\n");

        for (TransactionDetails t : transactions) {
            csvBuilder.append(t.getTransactionID()).append(",")
                    .append(t.getFromUser()).append(",")
                    .append(t.getToUser()).append(",")
                    .append(t.getAmount()).append("\n");
        }

        return csvBuilder.toString();
    }

    // --- Forex Currency Exchange ---
    @Transactional
    public CurrencyWallet convertCurrency(String email, Double amountINR, String targetCurrency) {
        UserDetails user = userDB.findByuEmail(email);
        long balance = (user != null && user.getAccountBalance() != null) ? user.getAccountBalance() : 0L;
        if (user == null || balance < Math.round(amountINR)) {
            throw new IllegalArgumentException("Insufficient INR balance for conversion");
        }

        // Deduct INR
        user.setAccountBalance(balance - Math.round(amountINR));
        userDB.save(user);

        // Fetch or Create Wallet
        Optional<CurrencyWallet> walletOpt = currencyWalletDB.findByAccountEmail(email);
        CurrencyWallet wallet = walletOpt.orElseGet(() -> {
            CurrencyWallet newWallet = new CurrencyWallet();
            newWallet.setAccountEmail(email);
            newWallet.setUsdBalance(0.0);
            newWallet.setEurBalance(0.0);
            newWallet.setGbpBalance(0.0);
            return newWallet;
        });

        // Conversion logic
        targetCurrency = targetCurrency.toUpperCase();
        switch (targetCurrency) {
            case "USD":
                wallet.setUsdBalance(wallet.getUsdBalance() + (amountINR * INR_TO_USD));
                break;
            case "EUR":
                wallet.setEurBalance(wallet.getEurBalance() + (amountINR * INR_TO_EUR));
                break;
            case "GBP":
                wallet.setGbpBalance(wallet.getGbpBalance() + (amountINR * INR_TO_GBP));
                break;
            default:
                throw new IllegalArgumentException("Unsupported currency: " + targetCurrency);
        }

        return currencyWalletDB.save(wallet);
    }

    public CurrencyWallet getMyWallet(String email) {
        return currencyWalletDB.findByAccountEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("No Forex Wallet Found"));
    }

    // --- Bank Service Requests State Machine ---
    @Transactional
    public BankServiceRequest generateServiceRequest(String email, String requestType) {
        UserDetails user = userDB.findByuEmail(email);
        
        // Deduction of specific service fee depending on request type
        long feeAmount = 0L;
        if (requestType.equalsIgnoreCase("CHEQUEBOOK")) {
            feeAmount = 200L;
        } else if (requestType.equalsIgnoreCase("DEBIT_CARD_REPLACEMENT")) {
            feeAmount = 450L;
        } else {
            feeAmount = 100L; // Default
        }

        long currentBalance = (user != null && user.getAccountBalance() != null) ? user.getAccountBalance() : 0L;
        if (user == null || currentBalance < feeAmount) {
            throw new IllegalArgumentException("Insufficient balance to pay for Service Fee of Rs. " + feeAmount);
        }

        // Deduct fee
        user.setAccountBalance(user.getAccountBalance() - feeAmount);
        userDB.save(user);

        // State Machine Initial State
        BankServiceRequest request = new BankServiceRequest();
        request.setAccountEmail(email);
        request.setRequestType(requestType.toUpperCase());
        request.setRequestStatus("REQUESTED");
        request.setApplicableFee((double) feeAmount);
        request.setCreationDate(LocalDate.now().toString());
        request.setUpdateDate(LocalDate.now().toString());

        return bankServiceRequestDB.save(request);
    }

    @Transactional
    public BankServiceRequest updateRequestStatus(Long requestId, String newStatus) {
        BankServiceRequest request = bankServiceRequestDB.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Service request not found"));
        
        // Validate State Machine transitions: REQUESTED -> PROCESSING -> DISPATCHED
        String currentStatus = request.getRequestStatus();
        newStatus = newStatus.toUpperCase();
        
        boolean validTransition = switch (currentStatus) {
            case "REQUESTED" -> newStatus.equals("PROCESSING");
            case "PROCESSING" -> newStatus.equals("DISPATCHED");
            default -> false;
        };
        
        if (!validTransition) {
            throw new IllegalArgumentException("Invalid state transition: " + currentStatus + " -> " + newStatus);
        }
        
        request.setRequestStatus(newStatus);
        request.setUpdateDate(LocalDate.now().toString());
        
        return bankServiceRequestDB.save(request);
    }
    
    public List<BankServiceRequest> getMyRequests(String email) {
        return bankServiceRequestDB.findByAccountEmail(email);
    }
}
