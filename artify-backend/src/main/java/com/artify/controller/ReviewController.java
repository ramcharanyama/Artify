package com.artify.controller;

import com.artify.dto.request.ReviewRequest;
import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.ReviewResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.User;
import com.artify.model.enums.Role;
import com.artify.repository.UserRepository;
import com.artify.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        Long userId = getCurrentUserId(userDetails);
        ReviewResponse response = reviewService.createReview(userId, request);
        return new ResponseEntity<>(ApiResponse.success("Review created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewResponse> response = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        boolean isAdmin = user.getRole() == Role.ADMIN;
        reviewService.deleteReview(id, user.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }

    private Long getCurrentUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return user.getId();
    }
}
