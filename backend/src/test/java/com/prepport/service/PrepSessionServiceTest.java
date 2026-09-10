package com.prepport.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.prepport.dto.PrepSessionDeletionImpact;
import com.prepport.entity.Batch;
import com.prepport.entity.Ingredient;
import com.prepport.entity.MacroBasis;
import com.prepport.entity.PortionLog;
import com.prepport.entity.PortionLogLine;
import com.prepport.entity.PrepSession;
import com.prepport.entity.User;
import com.prepport.repository.BatchRepository;
import com.prepport.repository.PortionLogLineRepository;
import com.prepport.repository.PortionLogRepository;
import com.prepport.repository.PrepSessionRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PrepSessionServiceTest {
  @Mock private PrepSessionRepository prepSessionRepository;
  @Mock private BatchRepository batchRepository;
  @Mock private PortionLogRepository portionLogRepository;
  @Mock private PortionLogLineRepository portionLogLineRepository;

  private final User user = new User("test@example.com", "passwordHash");
  private PrepSessionService prepSessionService;

  @BeforeEach
  void setUp() {
    prepSessionService =
        new PrepSessionService(
            prepSessionRepository, batchRepository, portionLogRepository, portionLogLineRepository);
  }

  @Test
  void deletePrepSession_withoutMeals_deletesSessionAndBatches() {
    PrepSession session = prepSession(1L);
    when(prepSessionRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(session));
    when(portionLogRepository.findDistinctByBatchPrepSessionId(1L)).thenReturn(List.of());

    prepSessionService.deletePrepSession(1L, false, user);

    verify(prepSessionRepository).delete(session);
    verify(portionLogRepository, never()).deleteAll(List.of());
  }

  @Test
  void deletePrepSession_withMealsWithoutConfirmation_returnsConflict() {
    PrepSession session = prepSession(1L);
    when(prepSessionRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(session));
    when(portionLogRepository.findDistinctByBatchPrepSessionId(1L))
        .thenReturn(List.of(new PortionLog("Lunch", LocalDate.now())));

    ResponseStatusException exception =
        assertThrows(
            ResponseStatusException.class,
            () -> prepSessionService.deletePrepSession(1L, false, user));

    assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    verify(prepSessionRepository, never()).delete(session);
  }

  @Test
  void deletePrepSession_withConfirmedMeals_deletesMealsBeforeSession() {
    PrepSession session = prepSession(1L);
    PortionLog meal = new PortionLog("Lunch", LocalDate.now());
    List<PortionLog> meals = List.of(meal);
    when(prepSessionRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(session));
    when(portionLogRepository.findDistinctByBatchPrepSessionId(1L)).thenReturn(meals);

    prepSessionService.deletePrepSession(1L, true, user);

    verify(portionLogRepository).deleteAll(meals);
    verify(portionLogRepository).flush();
    verify(prepSessionRepository).delete(session);
  }

  @Test
  void getDeletionImpact_withCrossSessionMeal_marksImpactAsCrossSession() {
    PrepSession firstSession = prepSession(1L);
    PrepSession secondSession = prepSession(2L);
    PortionLog meal = new PortionLog("Lunch", LocalDate.now());
    meal.addLine(new PortionLogLine(batch(1L, firstSession), 100));
    meal.addLine(new PortionLogLine(batch(2L, secondSession), 100));
    when(prepSessionRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(firstSession));
    when(portionLogRepository.findDistinctByBatchPrepSessionId(1L)).thenReturn(List.of(meal));

    PrepSessionDeletionImpact impact = prepSessionService.getDeletionImpact(1L, user);

    assertEquals(1, impact.affectedMealCount());
    assertTrue(impact.hasCrossSessionMeals());
  }

  @Test
  void getDeletionImpact_withoutCrossSessionMeal_marksImpactAsSessionOnly() {
    PrepSession session = prepSession(1L);
    PortionLog meal = new PortionLog("Lunch", LocalDate.now());
    meal.addLine(new PortionLogLine(batch(1L, session), 100));
    when(prepSessionRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(session));
    when(portionLogRepository.findDistinctByBatchPrepSessionId(1L)).thenReturn(List.of(meal));

    PrepSessionDeletionImpact impact = prepSessionService.getDeletionImpact(1L, user);

    assertFalse(impact.hasCrossSessionMeals());
  }

  @Test
  void deleteBatch_referencedByMeal_returnsConflict() {
    Batch batch = batch(1L, prepSession(1L));
    when(batchRepository.findByIdAndPrepSession_IdAndPrepSession_User(1L, 1L, user))
        .thenReturn(Optional.of(batch));
    when(portionLogLineRepository.existsByBatch_Id(1L)).thenReturn(true);

    ResponseStatusException exception =
        assertThrows(
            ResponseStatusException.class, () -> prepSessionService.deleteBatch(1L, 1L, user));

    assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    verify(batchRepository, never()).delete(batch);
  }

  private PrepSession prepSession(Long id) {
    PrepSession session = new PrepSession("Sunday prep", LocalDate.now());
    ReflectionTestUtils.setField(session, "id", id);
    return session;
  }

  private Batch batch(Long id, PrepSession session) {
    Batch batch =
        new Batch(new Ingredient("Chicken", MacroBasis.RAW, 25, 0, 3, 130), 1000.0, 750.0);
    batch.setPrepSession(session);
    ReflectionTestUtils.setField(batch, "id", id);
    return batch;
  }
}
