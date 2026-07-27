package com.prepport.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.Valid;

public record PortionExportRequest(
    @Valid @NotNull @NotEmpty List<PortionCalculateRequest> lines
) {}
