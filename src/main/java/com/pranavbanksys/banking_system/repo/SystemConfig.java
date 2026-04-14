package com.pranavbanksys.banking_system.repo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {
    @Id
    private String configKey; // e.g., "WIRE_FEE", "MAINTENANCE_MODE"
    private String configValue;
}
