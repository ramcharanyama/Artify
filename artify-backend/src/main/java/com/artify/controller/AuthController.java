package com.artify.controller;

import com.artify.dto.request.LoginRequest;
import com.artify.dto.request.ProfileUpdateRequest;
import com.artify.dto.request.RegisterRequest;
import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.AuthResponse;
import com.artify.dto.response.UserResponse;
import com.artify.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("Registration successful", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request) {
        UserResponse response = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }
}
