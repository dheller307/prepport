package com.prepport.service;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import com.prepport.repository.PortionLogRepository;
import com.prepport.repository.PortionLogLineRepository;
import com.prepport.repository.BatchRepository;
import com.prepport.entity.PortionLog;
import com.prepport.entity.PortionLogLine;
import com.prepport.dto.PortionLogRequest;
import com.prepport.dto.PortionLogLineRequest;
import com.prepport.entity.User;
import com.prepport.entity.Batch;

@Service
public class PortionLogService {
    private final PortionLogRepository portionLogRepository;
    private final PortionLogLineRepository portionLogLineRepository;
    private final BatchRepository batchRepository;

    public PortionLogService(PortionLogRepository portionLogRepository, PortionLogLineRepository portionLogLineRepository, BatchRepository batchRepository) {
        this.portionLogRepository = portionLogRepository;
        this.portionLogLineRepository = portionLogLineRepository;
        this.batchRepository = batchRepository;
    }

    @Transactional
    public PortionLog createPortionLog(PortionLogRequest request, User user) {
        Map<Long, Double> requestedByBatchId = new HashMap<>();
        
        for (PortionLogLineRequest line : request.lines()) {
            requestedByBatchId.merge(line.batchId(), line.cookedGrams(), Double::sum);
        }

        for (Map.Entry<Long, Double> entry : requestedByBatchId.entrySet()) {
            Long batchId = entry.getKey();
            Double cookedGrams = entry.getValue();
            
        }
    }

    
    
}