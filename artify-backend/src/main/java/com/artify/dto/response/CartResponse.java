package com.artify.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartResponse {
    private Long id;
    private Long userId;
    private List<CartItemResponse> items;
    private Double totalAmount;
}
