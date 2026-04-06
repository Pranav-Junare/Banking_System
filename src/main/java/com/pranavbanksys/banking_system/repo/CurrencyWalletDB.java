package com.pranavbanksys.banking_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyWalletDB extends JpaRepository<CurrencyWallet, Long> {
    Optional<CurrencyWallet> findByAccountEmail(String accountEmail);
}
