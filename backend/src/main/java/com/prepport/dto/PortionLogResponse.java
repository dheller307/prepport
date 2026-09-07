package com.prepport.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PortionLogResponse(
    Long id,
    String name,
    LocalDate portionDate,
    LocalDateTime createdAt,
    List<PortionLogLineResponse> lines
) {}
