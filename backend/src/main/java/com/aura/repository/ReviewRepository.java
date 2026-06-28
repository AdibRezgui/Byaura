package com.aura.repository;

import com.aura.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByDateDesc(Long productId);
    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
