package com.prepport.service;

import com.prepport.dto.PrepSessionDeletionImpact;
import com.prepport.entity.Batch;
import com.prepport.entity.PortionLog;
import com.prepport.entity.PrepSession;
import com.prepport.entity.User;
import com.prepport.repository.BatchRepository;
import com.prepport.repository.PortionLogLineRepository;
import com.prepport.repository.PortionLogRepository;
import com.prepport.repository.PrepSessionRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrepSessionService {
  private final PrepSessionRepository prepSessionRepository;
  private final BatchRepository batchRepository;
  private final PortionLogRepository portionLogRepository;
  private final PortionLogLineRepository portionLogLineRepository;

  public PrepSessionService(
      PrepSessionRepository prepSessionRepository,
      BatchRepository batchRepository,
      PortionLogRepository portionLogRepository,
      PortionLogLineRepository portionLogLineRepository) {
    this.prepSessionRepository = prepSessionRepository;
    this.batchRepository = batchRepository;
    this.portionLogRepository = portionLogRepository;
    this.portionLogLineRepository = portionLogLineRepository;
  }

  @Transactional(readOnly = true)
  public PrepSessionDeletionImpact getDeletionImpact(Long sessionId, User user) {
    findPrepSession(sessionId, user);
    List<PortionLog> affectedMeals =
        portionLogRepository.findDistinctByBatchPrepSessionId(sessionId);

    boolean hasCrossSessionMeals =
        affectedMeals.stream()
            .flatMap(meal -> meal.getLines().stream())
            .anyMatch(line -> !line.getBatch().getPrepSession().getId().equals(sessionId));

    return new PrepSessionDeletionImpact(affectedMeals.size(), hasCrossSessionMeals);
  }

  @Transactional
  public void deletePrepSession(Long sessionId, boolean deleteAssociatedMeals, User user) {
    PrepSession prepSession = findPrepSession(sessionId, user);
    List<PortionLog> affectedMeals =
        portionLogRepository.findDistinctByBatchPrepSessionId(sessionId);

    if (!affectedMeals.isEmpty() && !deleteAssociatedMeals) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "This prep session is used by "
              + affectedMeals.size()
              + " saved meal(s). Review the deletion warning before continuing.");
    }

    if (deleteAssociatedMeals) {
      portionLogRepository.deleteAll(affectedMeals);
      portionLogRepository.flush();
    }

    prepSessionRepository.delete(prepSession);
  }

  @Transactional
  public void deleteBatch(Long sessionId, Long batchId, User user) {
    Batch batch =
        batchRepository
            .findByIdAndPrepSession_IdAndPrepSession_User(batchId, sessionId, user)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));

    if (portionLogLineRepository.existsByBatch_Id(batchId)) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "Cannot delete this batch because it is used by saved meals. Delete those meals first.");
    }

    batchRepository.delete(batch);
  }

  private PrepSession findPrepSession(Long sessionId, User user) {
    return prepSessionRepository
        .findByIdAndUser(sessionId, user)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
  }
}
