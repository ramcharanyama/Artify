package com.artify.controller;

import com.artify.dto.request.PaymentRequest;
import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.PaymentResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.User;
import com.artify.repository.UserRepository;
import com.artify.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/process")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentRequest request) {
        Long userId = getCurrentUserId(userDetails);
        PaymentResponse response = paymentService.processPayment(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", response));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrderId(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {
        Long userId = getCurrentUserId(userDetails);
        PaymentResponse response = paymentService.getPaymentByOrderId(orderId, userId);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", response));
    }

    @PutMapping("/{orderId}/mark-cod-complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> markCODPaymentAsCompleted(
            @PathVariable Long orderId) {
        PaymentResponse response = paymentService.markCODPaymentAsCompleted(orderId);
        return ResponseEntity.ok(ApiResponse.success("COD payment marked as completed", response));
    }

    private Long getCurrentUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return user.getId();
    }
}
