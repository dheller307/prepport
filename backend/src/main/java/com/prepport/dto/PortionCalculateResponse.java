package com.prepport.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PortionCalculateResponse(
    @NotNull Long batchId,
    @NotNull String ingredientName,
    @NotNull @Positive Double cronometerG,
    @NotNull @Positive Double proteinG,
    @NotNull @Positive Double fatG,
    @NotNull @Positive Double carbsG,
    @NotNull @Positive Double kcal
) {}
