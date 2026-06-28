package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "editorial_look_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EditorialLookItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(name = "look_id", nullable = false)
    private Long lookId;

    @Column(name = "product_id")
    private Long productId;

    // Photo éditoriale spécifique pour ce produit dans ce look
    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
}
