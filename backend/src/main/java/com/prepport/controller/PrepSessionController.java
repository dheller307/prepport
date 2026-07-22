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
    public PrepSession createPrepSession(@RequestBody PrepSession prepSession, @AuthenticationPrincipal User user) {
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

    @GetMapping
    public List<PrepSession> listPrepSessions(@AuthenticationPrincipal User user) {
        return repository.findByUser(user);
    }

    @GetMapping("/{id}")
    public PrepSession getPrepSession(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
    }

    @PutMapping("/{id}")
    public PrepSession updatePrepSession(@PathVariable Long id, @RequestBody PrepSession prepSession, @AuthenticationPrincipal User user) {
        PrepSession prepSessionToUpdate = repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found"));
        prepSessionToUpdate.setSessionDate(prepSession.getSessionDate());
        prepSessionToUpdate.setNotes(prepSession.getNotes());
        return repository.save(prepSessionToUpdate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePrepSession(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (!repository.existsByIdAndUser(id, user)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Prep session not found");
        }
        repository.deleteByIdAndUser(id, user);
    }
}

    