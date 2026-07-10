package com.artify.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    private Double price;

    private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stock;

    private String status = "ACTIVE";
}
