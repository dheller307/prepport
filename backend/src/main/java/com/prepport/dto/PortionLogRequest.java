package com.prepport.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record PortionLogRequest(
    @NotBlank String name,
    @NotNull LocalDate portionDate,
    @NotEmpty List<@Valid PortionLogLineRequest> lines) {}
