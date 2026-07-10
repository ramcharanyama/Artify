package com.artify.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long orderId;
    private Long productId;
    private int quantity;
    private Double priceAtPurchase;
    private ProductResponse product;
}
