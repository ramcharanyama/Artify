package com.artify.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String avatarUrl;
    private String role;
    private LocalDateTime createdAt;
}
