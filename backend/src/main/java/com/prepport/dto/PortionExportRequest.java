package com.prepport.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;

public record PortionExportRequest(
    @NotNull @NotEmpty List<PortionCalculateRequest> lines
) {}
