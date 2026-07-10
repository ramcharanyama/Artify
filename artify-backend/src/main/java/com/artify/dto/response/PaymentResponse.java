package com.artify.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long orderId;
    private String method;
    private String transactionId;
    private Double amount;
    private String status;
    private LocalDateTime paidAt;
}
