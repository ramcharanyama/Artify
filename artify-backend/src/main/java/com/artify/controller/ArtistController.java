package com.artify.controller;

import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.ArtistResponse;
import com.artify.dto.response.UserResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.Artist;
import com.artify.model.User;
import com.artify.repository.ArtistRepository;
import com.artify.repository.ReviewRepository;
import com.artify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArtistController {

    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<List<ArtistResponse>> getAllArtists() {
        List<ArtistResponse> response = artistRepository.findAll().stream()
                .map(this::mapToArtistResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ApiResponse<ArtistResponse>> getCurrentArtist(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        Artist artist = artistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", user.getId()));
        ArtistResponse response = mapToArtistResponse(artist);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtistResponse>> getArtistById(@PathVariable Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", id));
        ArtistResponse response = mapToArtistResponse(artist);
        return ResponseEntity.ok(ApiResponse.success("Artist retrieved successfully", response));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<ApiResponse<ArtistResponse>> verifyArtist(@PathVariable Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", id));
        artist.setIsVerified(true);
        artist = artistRepository.save(artist);
        ArtistResponse response = mapToArtistResponse(artist);
        return ResponseEntity.ok(ApiResponse.success("Artist verified successfully", response));
    }

    private ArtistResponse mapToArtistResponse(Artist artist) {
        UserResponse userResponse = UserResponse.builder()
                .id(artist.getUser().getId())
                .email(artist.getUser().getEmail())
                .name(artist.getUser().getName())
                .phone(artist.getUser().getPhone())
                .address(artist.getUser().getAddress())
                .avatarUrl(artist.getUser().getAvatarUrl())
                .role(artist.getUser().getRole().name())
                .createdAt(artist.getUser().getCreatedAt())
                .build();

        Double rating = artist.getRating();
        if (rating == null || rating == 0.0) {
            Double avg = reviewRepository.calculateAverageRatingByArtistId(artist.getId());
            if (avg != null && avg > 0.0) {
                rating = Math.round(avg * 10.0) / 10.0;
            }
        }

        return ArtistResponse.builder()
                .id(artist.getId())
                .userId(artist.getUser().getId())
                .bio(artist.getBio())
                .portfolioUrl(artist.getPortfolioUrl())
                .isVerified(artist.getIsVerified())
                .rating(rating)
                .user(userResponse)
                .build();
    }
}
