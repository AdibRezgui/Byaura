package com.aura.service;

import com.aura.model.Review;
import com.aura.model.User;
import com.aura.repository.ReviewRepository;
import com.aura.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    private User user;
    private Review review;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).name("Alice").email("alice@test.com").build();
        review = Review.builder().id(1L).productId(10L).userId(1L).userName("Alice")
                .rating(5).comment("Great").date(123L).build();
    }

    @Test
    void addReview_savesReview() {
        when(reviewRepository.existsByProductIdAndUserId(10L, 1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        Review result = reviewService.addReview(1L, 10L, 5, "Great");

        assertEquals("Alice", result.getUserName());
        assertEquals(5, result.getRating());
    }

    @Test
    void addReview_throwsWhenRatingInvalid() {
        assertThrows(RuntimeException.class, () -> reviewService.addReview(1L, 10L, 0, "Bad"));
        assertThrows(RuntimeException.class, () -> reviewService.addReview(1L, 10L, 6, "Bad"));
    }

    @Test
    void addReview_throwsWhenAlreadyReviewed() {
        when(reviewRepository.existsByProductIdAndUserId(10L, 1L)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> reviewService.addReview(1L, 10L, 4, "Again"));
    }

    @Test
    void addReview_throwsWhenUserNotFound() {
        when(reviewRepository.existsByProductIdAndUserId(10L, 1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> reviewService.addReview(1L, 10L, 4, "Hi"));
    }

    @Test
    void getProductReviews_returnsEnrichedReviews() {
        when(reviewRepository.findByProductIdOrderByDateDesc(10L)).thenReturn(List.of(review));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        List<Map<String, Object>> result = reviewService.getProductReviews(10L);

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).get("userName"));
    }

    @Test
    void getProductReviews_handlesMissingUser() {
        when(reviewRepository.findByProductIdOrderByDateDesc(10L)).thenReturn(List.of(review));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        List<Map<String, Object>> result = reviewService.getProductReviews(10L);

        assertEquals(1, result.size());
        assertNull(result.get(0).get("userProfileImage"));
    }

    @Test
    void getProductStats_computesAverage() {
        Review review2 = Review.builder().id(2L).productId(10L).userId(2L).rating(3).date(124L).build();
        when(reviewRepository.findByProductIdOrderByDateDesc(10L)).thenReturn(List.of(review, review2));

        Map<String, Object> stats = reviewService.getProductStats(10L);

        assertEquals(2, stats.get("count"));
        assertEquals(4.0, stats.get("average"));
    }

    @Test
    void getProductStats_returnsZeroWhenNoReviews() {
        when(reviewRepository.findByProductIdOrderByDateDesc(10L)).thenReturn(List.of());

        Map<String, Object> stats = reviewService.getProductStats(10L);

        assertEquals(0, stats.get("count"));
        assertEquals(0.0, stats.get("average"));
    }
}
