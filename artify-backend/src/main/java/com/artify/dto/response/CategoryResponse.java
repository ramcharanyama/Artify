package com.artify.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
}
