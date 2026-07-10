package com.artify.service;

import com.artify.dto.request.LoginRequest;
import com.artify.dto.request.ProfileUpdateRequest;
import com.artify.dto.request.RegisterRequest;
import com.artify.dto.response.AuthResponse;
import com.artify.dto.response.UserResponse;
import com.artify.exception.DuplicateResourceException;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.Artist;
import com.artify.model.Cart;
import com.artify.model.User;
import com.artify.model.enums.Role;
import com.artify.repository.ArtistRepository;
import com.artify.repository.CartRepository;
import com.artify.repository.UserRepository;
import com.artify.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            role = Role.CUSTOMER;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .build();
        user = userRepository.save(user);

        Artist artist = null;
        if (role == Role.ARTIST) {
            artist = Artist.builder()
                    .user(user)
                    .bio("")
                    .portfolioUrl("")
                    .isVerified(false)
                    .rating(0.0)
                    .build();
            artist = artistRepository.save(artist);
        }

        if (role == Role.CUSTOMER) {
            Cart cart = Cart.builder()
                    .user(user)
                    .build();
            cartRepository.save(cart);
        }

        log.info("Registration completed for userId={}, artistId={}", user.getId(),
                role == Role.ARTIST && artist != null ? artist.getId() : null);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String token = jwtTokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
