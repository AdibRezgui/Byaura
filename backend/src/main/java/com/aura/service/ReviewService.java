package com.aura.service;

import com.aura.model.Review;
import com.aura.model.User;
import com.aura.repository.ReviewRepository;
import com.aura.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public Review addReview(Long userId, Long productId, Integer rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("La note doit être entre 1 et 5");
        }
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("Vous avez déjà laissé un avis pour ce produit");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Review review = Review.builder()
                .productId(productId)
                .userId(userId)
                .userName(user.getName())
                .rating(rating)
                .comment(comment)
                .date(System.currentTimeMillis())
                .build();

        return reviewRepository.save(review);
    }

    public List<Map<String, Object>> getProductReviews(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByDateDesc(productId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Review r : reviews) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("_id", r.getId());
            dto.put("productId", r.getProductId());
            dto.put("userId", r.getUserId());
            dto.put("userName", r.getUserName());
            dto.put("rating", r.getRating());
            dto.put("comment", r.getComment());
            dto.put("date", r.getDate());
            userRepository.findById(r.getUserId())
                    .ifPresent(u -> dto.put("userProfileImage", u.getProfileImage()));
            result.add(dto);
        }
        return result;
    }

    public Map<String, Object> getProductStats(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByDateDesc(productId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        return Map.of(
                "count", reviews.size(),
                "average", Math.round(avg * 10.0) / 10.0
        );
    }
}
