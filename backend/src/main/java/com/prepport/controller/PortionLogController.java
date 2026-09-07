package com.prepport.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import jakarta.validation.Valid;

import com.prepport.service.PortionLogService;
import com.prepport.dto.PortionLogRequest;
import com.prepport.dto.PortionLogResponse;
import com.prepport.entity.User;

@RestController
@RequestMapping("/api/portion-logs")
public class PortionLogController {
    private final PortionLogService portionLogService;

    public PortionLogController(PortionLogService portionLogService) {
        this.portionLogService = portionLogService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PortionLogResponse createPortionLog(@Valid @RequestBody PortionLogRequest request, @AuthenticationPrincipal User user) {
        return portionLogService.createPortionLog(request, user);
    }

    @GetMapping
    public List<PortionLogResponse> listPortionLogs(@AuthenticationPrincipal User user) {
        return portionLogService.listPortionLogs(user);
    }

    @GetMapping("/{id}")
    public PortionLogResponse getPortionLog(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return portionLogService.getPortionLog(id, user);
    }

    @PutMapping("/{id}")
    public PortionLogResponse updatePortionLog(@PathVariable Long id, @Valid @RequestBody PortionLogRequest request, @AuthenticationPrincipal User user) {
        return portionLogService.updatePortionLog(id, request, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePortionLog(@PathVariable Long id, @AuthenticationPrincipal User user) {
        portionLogService.deletePortionLog(id, user);
    }
}
