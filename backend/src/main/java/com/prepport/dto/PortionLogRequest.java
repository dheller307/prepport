package com.prepport.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.Valid;

public record PortionLogRequest(
    @NotBlank String name,
    @NotNull LocalDate portionDate,
    @NotEmpty List<@Valid PortionLogLineRequest> lines
) {}
