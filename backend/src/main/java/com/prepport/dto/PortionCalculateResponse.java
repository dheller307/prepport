package com.prepport.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record PortionCalculateResponse(
    @NotNull Long batchId,
    @NotNull String ingredientName,
    @NotNull @Positive Double cronometerG,
    @NotNull @PositiveOrZero Double proteinG,
    @NotNull @PositiveOrZero Double fatG,
    @NotNull @PositiveOrZero Double carbsG,
    @NotNull @Positive Double kcal
) {}
