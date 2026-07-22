package com.prepport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
    @NotBlank @Email @Size(max = 255) String email, 
    @NotBlank @Size(min = 8, max = 72) @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
        message = "Password must contain at least one digit, uppercase, lowercase, and special character"
    )String password
) {}