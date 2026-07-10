package com.artify.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private Double totalAmount;
    private String status;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
