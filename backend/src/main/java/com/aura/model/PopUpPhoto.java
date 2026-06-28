package com.aura.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pop_up_photos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PopUpPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("_id")
    private Long id;

    @Column(name = "popup_id", nullable = false)
    private Long popupId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
}
