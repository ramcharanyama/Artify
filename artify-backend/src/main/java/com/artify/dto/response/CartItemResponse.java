package com.artify.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long cartId;
    private Long productId;
    private int quantity;
    private ProductResponse product;
}
