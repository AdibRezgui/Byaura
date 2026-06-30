package com.aura.controller;

import com.aura.model.Review;
import com.aura.security.JwtUtil;
import com.aura.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewService reviewService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void addReview_returnsSuccess() throws Exception {
        Review review = Review.builder().id(1L).productId(10L).userId(1L).rating(5).comment("Top").build();
        when(reviewService.addReview(1L, 10L, 5, "Top")).thenReturn(review);

        Map<String, Object> body = Map.of("productId", 10, "rating", 5, "comment", "Top");

        mockMvc.perform(post("/api/review/add")
                        .principal(new UsernamePasswordAuthenticationToken("1", null))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.review.rating").value(5));
    }

    @Test
    void addReview_returnsFailureOnException() throws Exception {
        when(reviewService.addReview(1L, 10L, 6, "Bad")).thenThrow(new RuntimeException("La note doit être entre 1 et 5"));

        Map<String, Object> body = Map.of("productId", 10, "rating", 6, "comment", "Bad");

        mockMvc.perform(post("/api/review/add")
                        .principal(new UsernamePasswordAuthenticationToken("1", null))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getProductReviews_returnsReviewsAndStats() throws Exception {
        when(reviewService.getProductReviews(10L)).thenReturn(List.of(Map.of("rating", 5)));
        when(reviewService.getProductStats(10L)).thenReturn(Map.of("count", 1, "average", 5.0));

        mockMvc.perform(get("/api/review/product/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.average").value(5.0));
    }
}
