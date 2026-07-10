package com.artify.controller;

import com.artify.dto.request.CartItemRequest;
import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.CartResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.User;
import com.artify.repository.UserRepository;
import com.artify.service.CartService;
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
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        CartResponse response = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", response));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequest request) {
        Long userId = getCurrentUserId(userDetails);
        CartResponse response = cartService.addItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart successfully", response));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemRequest request) {
        Long userId = getCurrentUserId(userDetails);
        CartResponse response = cartService.updateItem(userId, itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated successfully", response));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        Long userId = getCurrentUserId(userDetails);
        CartResponse response = cartService.removeItem(userId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart successfully", response));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully", null));
    }

    private Long getCurrentUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return user.getId();
    }
}
