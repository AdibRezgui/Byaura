package com.aura.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private boolean active = false;

    private String startDate;
    private String endDate;

    // JSON array of product IDs: [1, 2, 3]
    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String productIds = "[]";
}
