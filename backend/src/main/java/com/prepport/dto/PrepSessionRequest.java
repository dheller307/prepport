package com.prepport.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public record PrepSessionRequest(
    @NotBlank(message = "Name cannot be blank") String name,
    @NotNull LocalDate sessionDate,
    String notes
) {}
