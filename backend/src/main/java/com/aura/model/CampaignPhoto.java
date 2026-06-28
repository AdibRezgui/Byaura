package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaign_photos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CampaignPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "product_id")
    private Long productId;

    private String caption;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
}
