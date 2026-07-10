package com.artify.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long userId;
    private Long productId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String userName;
}
