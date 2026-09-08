package com.prepport.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PortionExportRequest(@Valid @NotNull @NotEmpty List<PortionCalculateRequest> lines) {}
