package com.prepport.service;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.Mock;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import com.prepport.repository.BatchRepository;
import com.prepport.entity.User;
import com.prepport.entity.Ingredient;
import com.prepport.entity.MacroBasis;
import com.prepport.entity.Batch;
import com.prepport.dto.PortionCalculateRequest;
import com.prepport.dto.PortionCalculateResponse;
import com.prepport.yield.YieldCalculator;

@DisplayName("PortionService tests")
@ExtendWith(MockitoExtension.class)
class PortionServiceTest {
    @Mock
    private BatchRepository batchRepository;

    private PortionService portionService;

    @BeforeEach
    void setUp() {
        YieldCalculator yieldCalculator = new YieldCalculator();
        portionService = new PortionService(batchRepository, yieldCalculator);
    }

    User user = new User("test@test.com", "passwordHash");

    private Batch chickenBatch() {
        Ingredient ingredient = new Ingredient("Chicken", MacroBasis.RAW, 22.5, 0, 2.6, 120);
        Batch batch = new Batch(ingredient, 2146.0, 1600.0);
        return batch;
    }

    @Test
    @DisplayName("calculatePortion should return the correct response for chicken batch")
    void calculatePortion_chickenBatch() {
        when(batchRepository.findByIdAndPrepSession_User(1L, user)).thenReturn(Optional.of(chickenBatch()));
        
        PortionCalculateResponse result = portionService.calculatePortion(new PortionCalculateRequest(1L, 200.0), user);
        
        assertEquals("Chicken", result.ingredientName());
        assertEquals(268.25, result.cronometerG());
        assertEquals(60.356, result.proteinG(), 0.1);
        assertEquals(0.0, result.carbsG());
        assertEquals(6.974, result.fatG(), 0.1);
        assertEquals(321.9, result.kcal(), 0.1);
        
        verify(batchRepository).findByIdAndPrepSession_User(1L, user);
    }

    @Test
    @DisplayName("calculatePortion should throw NotFoundException if batch not found")
    void calculatePortion_batchNotFound() {
        when(batchRepository.findByIdAndPrepSession_User(1L, user)).thenReturn(Optional.empty());
        
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> portionService.calculatePortion(new PortionCalculateRequest(1L, 200.0), user));
        
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Batch not found", exception.getReason());
        
        verify(batchRepository).findByIdAndPrepSession_User(1L, user);
    }
}
