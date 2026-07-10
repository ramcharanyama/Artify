package com.artify.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ArtistResponse {
    private Long id;
    private Long userId;
    private String bio;
    private String portfolioUrl;
    private Boolean isVerified;
    private Double rating;
    private UserResponse user;
}
