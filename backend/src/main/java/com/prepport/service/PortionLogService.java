package com.prepport.service;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
import com.prepport.dto.PortionLogResponse;
import com.prepport.dto.PortionLogLineResponse;
import com.prepport.dto.PortionCalculateResponse;
import com.prepport.entity.User;
import com.prepport.entity.Batch;

@Service
public class PortionLogService {
    private final PortionLogRepository portionLogRepository;
    private final PortionLogLineRepository portionLogLineRepository;
    private final BatchRepository batchRepository;
    private final PortionService portionService;

    public PortionLogService(
            PortionLogRepository portionLogRepository,
            PortionLogLineRepository portionLogLineRepository,
            BatchRepository batchRepository,
            PortionService portionService) {
        this.portionLogRepository = portionLogRepository;
        this.portionLogLineRepository = portionLogLineRepository;
        this.batchRepository = batchRepository;
        this.portionService = portionService;
    }

    @Transactional
    public PortionLogResponse createPortionLog(PortionLogRequest request, User user) {
        List<PortionLogLine> lines = buildValidatedLines(request, user, null);
        PortionLog portionLog = new PortionLog(request.name(), request.portionDate());
        portionLog.setUser(user);
        portionLog.replaceLines(lines);

        return toResponse(portionLogRepository.save(portionLog));
    }

    @Transactional(readOnly = true)
    public List<PortionLogResponse> listPortionLogs(User user) {
        return portionLogRepository.findByUserOrderByPortionDateDesc(user).stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public PortionLogResponse getPortionLog(Long id, User user) {
        return toResponse(portionLogRepository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portion log not found")));
    }

    @Transactional
    public PortionLogResponse updatePortionLog(Long id, PortionLogRequest request, User user) {
        PortionLog portionLog = portionLogRepository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portion log not found"));
        List<PortionLogLine> lines = buildValidatedLines(request, user, portionLog.getId());
        portionLog.setName(request.name());
        portionLog.setPortionDate(request.portionDate());
        portionLog.replaceLines(lines);
        return toResponse(portionLogRepository.save(portionLog));
    }

    @Transactional
    public void deletePortionLog(Long id, User user) {
        PortionLog portionLog = portionLogRepository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Portion log not found"));
        portionLogRepository.delete(portionLog);
    }

    private List<PortionLogLine> buildValidatedLines(PortionLogRequest request, User user, Long excludedPortionLogId) {
        Map<Long, Double> requestedByBatchId = new HashMap<>();
        for (PortionLogLineRequest line : request.lines()) {
            requestedByBatchId.merge(line.batchId(), line.cookedGrams(), Double::sum);
        }

        List<PortionLogLine> lines = new ArrayList<>();
        for (Map.Entry<Long, Double> entry : requestedByBatchId.entrySet()) {
            Long batchId = entry.getKey();
            Double cookedGrams = entry.getValue();
            Batch batch = batchRepository.findByIdAndPrepSession_User(batchId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));
            
            double alreadyUsed = excludedPortionLogId == null ? portionLogLineRepository.sumCookedGramsByBatchId(batchId) : portionLogLineRepository.sumCookedGramsByBatchIdExcludingPortionLogId(batchId, excludedPortionLogId);
            if (alreadyUsed + cookedGrams > batch.getCookedWeightG()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, batch.getIngredient().getName() + " has only " + (batch.getCookedWeightG() - alreadyUsed) + " grams left in this batch.");
            }

            lines.add(new PortionLogLine(batch, cookedGrams));
        }
        return lines;
    }

    private PortionLogResponse toResponse(PortionLog portionLog) {
        List<PortionLogLineResponse> lines = new ArrayList<>();
        double totalProteinG = 0;
        double totalCarbsG = 0;
        double totalFatG = 0;
        double totalKcal = 0;

        for (PortionLogLine line : portionLog.getLines()) {
            PortionCalculateResponse calculation = portionService
                .calculateForBatch(line.getBatch(), line.getCookedGrams());

            lines.add(new PortionLogLineResponse(
                line.getBatch().getId(),
                line.getBatch().getPrepSession().getId(),
                calculation.ingredientName(),
                line.getCookedGrams(),
                calculation.cronometerG(),
                calculation.proteinG(),
                calculation.carbsG(),
                calculation.fatG(),
                calculation.kcal()
            ));
            totalProteinG += calculation.proteinG();
            totalCarbsG += calculation.carbsG();
            totalFatG += calculation.fatG();
            totalKcal += calculation.kcal();
        }

        return new PortionLogResponse(
            portionLog.getId(),
            portionLog.getName(),
            portionLog.getPortionDate(),
            portionLog.getCreatedAt(),
            lines,
            totalProteinG,
            totalCarbsG,
            totalFatG,
            totalKcal
        );
    }
    
}