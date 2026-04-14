package com.pranavbanksys.banking_system.service;

import com.pranavbanksys.banking_system.repo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Automated Investment Maturation Scheduler
 * Runs daily at midnight to check for matured FDs and SIPs.
 * When an investment matures, the maturity amount is credited
 * to the user's main wallet and the investment status is set to MATURED.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InvestmentMaturationScheduler {

    private final FixedDeposit_DB fdDb;
    private final SIP_DB sipDb;
    private final UserDB userDb;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void processMaturedInvestments() {
        log.info("Running daily investment maturation check...");
        String today = LocalDate.now().toString(); // Format: YYYY-MM-DD

        processFDs(today);
        processSIPs(today);

        log.info("Investment maturation check complete.");
    }

    private void processFDs(String today) {
        List<FixedDeposit_Details> allFDs = fdDb.findAll();
        for (FixedDeposit_Details fd : allFDs) {
            if ("ACTIVE".equals(fd.getFdStatus()) && fd.getFdMaturityDate() != null) {
                // Compare maturity date (stored as string) with today
                if (fd.getFdMaturityDate().compareTo(today) <= 0) {
                    log.info("FD #{} matured for user {}. Crediting ₹{}", fd.getFdID(), fd.getAccountEmail(), fd.getFdMaturityAmount());
                    // Credit maturity amount to user's balance
                    UserDetails user = userDb.findByuEmail(fd.getAccountEmail());
                    if (user != null) {
                        user.setAccountBalance(user.getAccountBalance() + Math.round(fd.getFdMaturityAmount()));
                        userDb.save(user);
                    }
                    fd.setFdStatus("MATURED");
                    fdDb.save(fd);
                }
            }
        }
    }

    private void processSIPs(String today) {
        List<SIP_Details> allSIPs = sipDb.findAll();
        for (SIP_Details sip : allSIPs) {
            if ("ACTIVE".equals(sip.getSipStatus()) && sip.getSipMaturityDate() != null) {
                if (sip.getSipMaturityDate().compareTo(today) <= 0) {
                    log.info("SIP #{} matured for user {}. Crediting ₹{}", sip.getId(), sip.getAccountEmail(), sip.getSipMaturityAmount());
                    UserDetails user = userDb.findByuEmail(sip.getAccountEmail());
                    if (user != null) {
                        user.setAccountBalance(user.getAccountBalance() + Math.round(sip.getSipMaturityAmount()));
                        userDb.save(user);
                    }
                    sip.setSipStatus("MATURED");
                    sipDb.save(sip);
                }
            }
        }
    }
}
