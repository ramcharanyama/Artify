package com.artify.controller;

import com.artify.dto.request.OrderRequest;
import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.OrderResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.User;
import com.artify.repository.UserRepository;
import com.artify.service.OrderService;
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
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
        Long userId = getCurrentUserId(userDetails);
        OrderResponse response = orderService.placeOrder(userId, request);
        return new ResponseEntity<>(ApiResponse.success("Order placed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<OrderResponse> response = orderService.getOrders(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getCurrentUserId(userDetails);
        OrderResponse response = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", response));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getCurrentUserId(userDetails);
        OrderResponse response = orderService.cancelOrder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", response));
    }

    @GetMapping("/{id}/track")
    public ResponseEntity<ApiResponse<OrderResponse>> trackOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getCurrentUserId(userDetails);
        OrderResponse response = orderService.trackOrder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Order tracking info retrieved", response));
    }

    private Long getCurrentUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return user.getId();
    }
}
