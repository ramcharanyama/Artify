package com.artify.service;

import com.artify.dto.request.ReviewRequest;
import com.artify.dto.response.ReviewResponse;
import com.artify.exception.DuplicateResourceException;
import com.artify.exception.ResourceNotFoundException;
import com.artify.exception.UnauthorizedException;
import com.artify.model.Product;
import com.artify.model.Review;
import com.artify.model.User;
import com.artify.repository.ProductRepository;
import com.artify.repository.ReviewRepository;
import com.artify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new DuplicateResourceException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        log.info("Review created with id: {} for product: {}", review.getId(), product.getId());
        return mapToReviewResponse(review);
    }

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!isAdmin && !review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
        log.info("Review deleted with id: {}", reviewId);
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .userName(review.getUser().getName())
                .build();
    }
}
