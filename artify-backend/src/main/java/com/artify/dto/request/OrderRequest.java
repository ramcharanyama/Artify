package com.artify.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}
