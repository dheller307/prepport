package com.prepport.controller;

import java.util.List;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;

import com.prepport.repository.PrepSessionRepository;
import com.prepport.repository.BatchRepository;
import com.prepport.repository.IngredientRepository;
import com.prepport.entity.PrepSession;
import com.prepport.entity.Batch;
import com.prepport.entity.Ingredient;
import com.prepport.entity.User;
import com.prepport.dto.CreateBatchRequest;
import com.prepport.dto.PrepSessionRequest;

@RestController
@RequestMapping("/api/prep-sessions")
public class PrepSessionController {

    private final PrepSessionRepository repository;
    private final BatchRepository batchRepository;
    private final IngredientRepository ingredientRepository;
    
    public PrepSessionController(PrepSessionRepository repository, BatchRepository batchRepository, IngredientRepository ingredientRepository) {
        this.repository = repository;
        this.batchRepository = batchRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PrepSession createPrepSession(@Valid @RequestBody PrepSessionRequest request, @AuthenticationPrincipal User user) {
        PrepSession prepSession = new PrepSession(request.name(), request.sessionDate());
        prepSession.setNotes(request.notes());
        prepSession.setUser(user);
        
        return repository.save(prepSession);
    }

    @PostMapping("/{id}/batches")
    @ResponseStatus(HttpStatus.CREATED)
    public Batch createBatch(@PathVariable Long id, @Valid @RequestBody CreateBatchRequest request, @AuthenticationPrincipal User user) {
        PrepSession prepSession = repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
        Ingredient ingredient = ingredientRepository.findByIdAndUser(request.ingredientId(), user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found"));
        Batch batch = new Batch(ingredient, request.rawWeightG(), request.cookedWeightG());
        batch.setPrepSession(prepSession);
        return batchRepository.save(batch);
    }

    @PutMapping("/{sessionId}/batches/{batchId}")
    public Batch updateBatch(@PathVariable Long sessionId, @PathVariable Long batchId, @Valid @RequestBody CreateBatchRequest request, @AuthenticationPrincipal User user) {
        Batch batch = batchRepository.findByIdAndPrepSession_IdAndPrepSession_User(batchId, sessionId, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));
        batch.setIngredient(ingredientRepository.findByIdAndUser(request.ingredientId(), user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found")));
        batch.setRawWeightG(request.rawWeightG());
        batch.setCookedWeightG(request.cookedWeightG());
        return batchRepository.save(batch);
    }

    @DeleteMapping("/{sessionId}/batches/{batchId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBatch(@PathVariable Long sessionId, @PathVariable Long batchId, @AuthenticationPrincipal User user) {
        Batch batch = batchRepository.findByIdAndPrepSession_IdAndPrepSession_User(batchId, sessionId, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));
        batchRepository.delete(batch);
    }

    @GetMapping
    public List<PrepSession> listPrepSessions(@AuthenticationPrincipal User user) {
        return repository.findByUser(user);
    }

    @GetMapping("/{id}")
    public PrepSession getPrepSession(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
    }

    @PutMapping("/{id}")
    public PrepSession updatePrepSession(@PathVariable Long id, @Valid @RequestBody PrepSessionRequest request, @AuthenticationPrincipal User user) {
        PrepSession prepSessionToUpdate = repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
        prepSessionToUpdate.setName(request.name());
        prepSessionToUpdate.setSessionDate(request.sessionDate());
        prepSessionToUpdate.setNotes(request.notes());
        return repository.save(prepSessionToUpdate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePrepSession(@PathVariable Long id, @AuthenticationPrincipal User user) {
        PrepSession prepSessionToDelete = repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
        repository.delete(prepSessionToDelete);
    }
}

    