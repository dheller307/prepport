package com.prepport.dto;

import com.prepport.entity.MacroBasis;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record IngredientRequest(
    @NotBlank String name,
    @NotNull MacroBasis macroBasis,
    @NotNull @PositiveOrZero Double proteinPer100g,
    @NotNull @PositiveOrZero Double carbsPer100g,
    @NotNull @PositiveOrZero Double fatPer100g,
    @NotNull @PositiveOrZero Double kcalPer100g,
    String notes) {}
