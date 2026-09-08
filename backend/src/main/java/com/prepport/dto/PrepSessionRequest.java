package com.prepport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PrepSessionRequest(
    @NotBlank(message = "Name cannot be blank") String name,
    @NotNull LocalDate sessionDate,
    String notes) {}
