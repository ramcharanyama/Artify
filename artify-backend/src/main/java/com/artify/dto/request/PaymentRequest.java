package com.artify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Payment method is required")
    private String method;
}
