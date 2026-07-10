package com.artify.controller;

import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.ArtistResponse;
import com.artify.dto.response.UserResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.Artist;
import com.artify.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistRepository artistRepository;

    @GetMapping
    public ResponseEntity<List<ArtistResponse>> getAllArtists() {
        List<ArtistResponse> response = artistRepository.findAll().stream()
                .map(this::mapToArtistResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
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

        return ArtistResponse.builder()
                .id(artist.getId())
                .userId(artist.getUser().getId())
                .bio(artist.getBio())
                .portfolioUrl(artist.getPortfolioUrl())
                .isVerified(artist.getIsVerified())
                .rating(artist.getRating())
                .user(userResponse)
                .build();
    }
}
