package com.prepport.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;

import com.prepport.service.PortionService;
import com.prepport.dto.PortionCalculateRequest;
import com.prepport.dto.PortionCalculateResponse;
import com.prepport.dto.PortionExportRequest;
import com.prepport.entity.User;

@RestController
@RequestMapping("/api/portion")
public class PortionController {
    private final PortionService portionService;

    public PortionController(PortionService portionService) {
        this.portionService = portionService;
    }

    @PostMapping("/calculate")
    public PortionCalculateResponse calculatePortion(@Valid @RequestBody PortionCalculateRequest request, @AuthenticationPrincipal User user) {
        return portionService.calculatePortion(request, user);
    }
    
    @PostMapping(value = "/export", produces = MediaType.TEXT_PLAIN_VALUE)
    public String exportPortion(@Valid @RequestBody PortionExportRequest request, @AuthenticationPrincipal User user) {
        return portionService.exportPortion(request, user);
    }
}
