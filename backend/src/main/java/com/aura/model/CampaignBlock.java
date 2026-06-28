package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaign_blocks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CampaignBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(name = "left_text", columnDefinition = "TEXT")
    private String leftText;

    @Column(name = "right_text", columnDefinition = "TEXT")
    private String rightText;

    // "normal" | "polaroid"
    @Column(name = "media_style")
    @Builder.Default
    private String mediaStyle = "normal";

    // after which photo pair this block appears (1 = after pair 1, etc.)
    @Column(name = "insert_after_pair")
    @Builder.Default
    private Integer insertAfterPair = 1;
}
