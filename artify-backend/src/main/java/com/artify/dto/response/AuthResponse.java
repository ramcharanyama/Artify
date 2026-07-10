package com.artify.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UserResponse user;
}
