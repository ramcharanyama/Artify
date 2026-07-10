package com.artify.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private Long artistId;
    private Long categoryId;
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private int stock;
    private String status;
    private LocalDateTime createdAt;
    private String artistName;
    private String categoryName;
}
