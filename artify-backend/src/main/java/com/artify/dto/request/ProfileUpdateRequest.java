package com.artify.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String phone;
    private String address;
    private String avatarUrl;
}
