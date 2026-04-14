package com.pranavbanksys.banking_system;

import com.pranavbanksys.banking_system.enums.AccountStatus;
import com.pranavbanksys.banking_system.enums.AccountTier;
import com.pranavbanksys.banking_system.enums.AdminRole;
import com.pranavbanksys.banking_system.enums.KycStatus;
import com.pranavbanksys.banking_system.repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DummyDataLoader implements CommandLineRunner {

    private final UserDB userDB;
    private final AdminDB adminDB;
    private final SystemConfigRepo systemConfigRepo;
    private final TransactionDB transactionDB;

    public DummyDataLoader(UserDB userDB, AdminDB adminDB, SystemConfigRepo systemConfigRepo, TransactionDB transactionDB) {
        this.userDB = userDB;
        this.adminDB = adminDB;
        this.systemConfigRepo = systemConfigRepo;
        this.transactionDB = transactionDB;
    }

    @Override
    public void run(String... args) throws Exception {
        loadSystemConfig();
        loadAdmins();
        loadUsers();
        // Ignoring transaction dummy data here because it might require more logic for ID generation, but we could add basic records.
    }

    private void loadSystemConfig() {
        if (systemConfigRepo.count() == 0) {
            systemConfigRepo.save(new SystemConfig("WIRE_FEE", "15.00"));
            systemConfigRepo.save(new SystemConfig("MAINTENANCE_MODE", "false"));
        }
    }

    private void loadAdmins() {
        if (adminDB.count() == 0) {
            AdminDetails superAdmin = new AdminDetails();
            superAdmin.setAName("Super Admin");
            superAdmin.setAEmail("superadmin@pranavbank.com");
            superAdmin.setAPassword("admin123");
            superAdmin.setRole(AdminRole.SUPER_ADMIN);

            AdminDetails compliance = new AdminDetails();
            compliance.setAName("Compliance Officer");
            compliance.setAEmail("compliance@pranavbank.com");
            compliance.setAPassword("admin123");
            compliance.setRole(AdminRole.COMPLIANCE_OFFICER);

            AdminDetails support = new AdminDetails();
            support.setAName("Support Agent");
            support.setAEmail("support@pranavbank.com");
            support.setAPassword("admin123");
            support.setRole(AdminRole.SUPPORT_AGENT);

            adminDB.save(superAdmin);
            adminDB.save(compliance);
            adminDB.save(support);
        }
    }

    private void loadUsers() {
        if (userDB.count() == 0) {
            UserDetails user1 = new UserDetails();
            user1.setUName("John Doe");
            user1.setUEmail("john@example.com");
            user1.setUPassword("password");
            user1.setPhoneNumber(1234567890L);
            user1.setAccountBalance(50000L);
            user1.setKycStatus(KycStatus.APPROVED);
            user1.setAccountStatus(AccountStatus.ACTIVE);
            user1.setAccountTier(AccountTier.TIER_2);

            UserDetails user2 = new UserDetails();
            user2.setUName("Jane Smith");
            user2.setUEmail("jane@example.com");
            user2.setUPassword("password");
            user2.setPhoneNumber(9876543210L);
            user2.setAccountBalance(1500L);
            user2.setKycStatus(KycStatus.PENDING);
            user2.setAccountStatus(AccountStatus.ACTIVE);
            user2.setAccountTier(AccountTier.TIER_1);

            UserDetails user3 = new UserDetails();
            user3.setUName("Frozen User");
            user3.setUEmail("frozen@example.com");
            user3.setUPassword("password");
            user3.setPhoneNumber(5555555555L);
            user3.setAccountBalance(12000L);
            user3.setKycStatus(KycStatus.REJECTED);
            user3.setAccountStatus(AccountStatus.FROZEN);
            user3.setAccountTier(AccountTier.TIER_1);

            userDB.save(user1);
            userDB.save(user2);
            userDB.save(user3);
        }
    }
}
