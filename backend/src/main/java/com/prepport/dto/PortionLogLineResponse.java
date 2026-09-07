package com.prepport.dto;

public record PortionLogLineResponse(
    Long batchId,
    Long prepSessionId,
    String ingredientName,
    double cookedGrams
) {}
