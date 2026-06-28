package com.aura.controller;

import com.aura.model.Review;
import com.aura.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addReview(
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            Long productId = Long.parseLong(body.get("productId").toString());
            Integer rating = ((Number) body.get("rating")).intValue();
            String comment = (String) body.get("comment");

            Review review = reviewService.addReview(userId, productId, rating, comment);
            result.put("success", true);
            result.put("review", review);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getProductReviews(@PathVariable Long productId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Map<String, Object>> reviews = reviewService.getProductReviews(productId);
            Map<String, Object> stats = reviewService.getProductStats(productId);
            result.put("success", true);
            result.put("reviews", reviews);
            result.put("count", stats.get("count"));
            result.put("average", stats.get("average"));
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
