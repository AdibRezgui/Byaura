package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String composition;

    @Column(nullable = false)
    private String category;

    @Column(name = "sub_category", nullable = false)
    private String subCategory;

    @Column(nullable = false)
    private Double price;

    // Key = size name (S, M, L…), Value = stock quantity
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private Map<String, Integer> sizes = new HashMap<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean bestseller = false;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column
    private Long date;

    // Null = pas en solde, valeur > 0 = prix soldé
    @Column(name = "sale_price")
    private Double salePrice;

    // CSS color value (hex like "#000000") for the color swatch
    @Column
    private String color;

    // Products sharing the same colorGroup are variants of each other
    @Column(name = "color_group")
    private String colorGroup;
}
