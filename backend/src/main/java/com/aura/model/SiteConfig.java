package com.aura.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteConfig {

    @Id
    private String configKey;

    @Column(columnDefinition = "TEXT")
    private String configValue;
}
