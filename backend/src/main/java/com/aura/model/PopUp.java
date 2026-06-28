package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pop_ups")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PopUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    private String place;

    private String date;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Boolean active = false;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
}
