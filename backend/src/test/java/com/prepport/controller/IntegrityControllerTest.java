package com.prepport.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.prepport.dto.CreateBatchRequest;
import com.prepport.entity.Batch;
import com.prepport.entity.Ingredient;
import com.prepport.entity.MacroBasis;
import com.prepport.entity.User;
import com.prepport.repository.BatchRepository;
import com.prepport.repository.IngredientRepository;
import com.prepport.repository.PortionLogLineRepository;
import com.prepport.repository.PrepSessionRepository;
import com.prepport.service.PrepSessionService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class IntegrityControllerTest {
  @Mock private PrepSessionRepository prepSessionRepository;
  @Mock private BatchRepository batchRepository;
  @Mock private IngredientRepository ingredientRepository;
  @Mock private PortionLogLineRepository portionLogLineRepository;
  @Mock private PrepSessionService prepSessionService;

  private final User user = new User("test@example.com", "passwordHash");
  private PrepSessionController prepSessionController;
  private IngredientController ingredientController;

  @BeforeEach
  void setUp() {
    prepSessionController =
        new PrepSessionController(
            prepSessionRepository,
            batchRepository,
            ingredientRepository,
            portionLogLineRepository,
            prepSessionService);
    ingredientController = new IngredientController(ingredientRepository, batchRepository);
  }

  @Test
  void updateBatch_belowSavedCookedGrams_returnsBadRequest() {
    Batch batch =
        new Batch(new Ingredient("Chicken", MacroBasis.RAW, 25, 0, 3, 130), 1000.0, 750.0);
    when(batchRepository.findByIdAndPrepSession_IdAndPrepSession_User(2L, 1L, user))
        .thenReturn(Optional.of(batch));
    when(portionLogLineRepository.sumCookedGramsByBatchId(2L)).thenReturn(300.0);

    ResponseStatusException exception =
        assertThrows(
            ResponseStatusException.class,
            () ->
                prepSessionController.updateBatch(
                    1L, 2L, new CreateBatchRequest(3L, 1000.0, 200.0), user));

    assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    verify(batchRepository, never()).save(batch);
  }

  @Test
  void deleteIngredient_usedByBatch_returnsConflict() {
    Ingredient ingredient = new Ingredient("Chicken", MacroBasis.RAW, 25, 0, 3, 130);
    when(ingredientRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(ingredient));
    when(batchRepository.existsByIngredient_Id(1L)).thenReturn(true);

    ResponseStatusException exception =
        assertThrows(
            ResponseStatusException.class, () -> ingredientController.deleteIngredient(1L, user));

    assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    verify(ingredientRepository, never()).delete(ingredient);
  }
}
