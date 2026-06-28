package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaigns")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String headline;
    private String subtitle;

    @Column(name = "hero_image")
    private String heroImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "col1_title") private String col1Title;
    @Column(name = "col1_body", columnDefinition = "TEXT") private String col1Body;
    @Column(name = "col2_title") private String col2Title;
    @Column(name = "col2_body", columnDefinition = "TEXT") private String col2Body;

    @Builder.Default
    private Boolean active = true;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
}
