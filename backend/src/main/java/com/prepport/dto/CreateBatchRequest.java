package com.prepport.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateBatchRequest(
    @NotNull Long ingredientId,
    @NotNull @Positive Double rawWeightG,
    @NotNull @Positive Double cookedWeightG
) {
    
}
