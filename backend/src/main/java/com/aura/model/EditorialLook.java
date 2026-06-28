package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "editorial_looks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EditorialLook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Boolean active = true;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;

    // Comma-separated product IDs: "1,3,5"
    @Column(name = "product_ids", columnDefinition = "TEXT")
    private String productIds;
}
