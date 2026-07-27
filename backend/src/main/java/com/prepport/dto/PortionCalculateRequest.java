package com.prepport.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PortionCalculateRequest(
    @NotNull Long batchId,
    @NotNull @Positive Double cookedGrams
) {}
