package com.prepport.dto;

public record PortionLogLineResponse(
    Long batchId,
    Long prepSessionId,
    String ingredientName,
    double cookedGrams,
    double cronometerG,
    double proteinG,
    double carbsG,
    double fatG,
    double kcal) {}
