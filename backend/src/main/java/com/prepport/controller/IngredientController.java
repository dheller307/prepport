package com.prepport.controller;

import com.prepport.dto.IngredientRequest;
import com.prepport.entity.Ingredient;
import com.prepport.entity.User;
import com.prepport.repository.BatchRepository;
import com.prepport.repository.IngredientRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {
  private final IngredientRepository repository;
  private final BatchRepository batchRepository;

  public IngredientController(IngredientRepository repository, BatchRepository batchRepository) {
    this.repository = repository;
    this.batchRepository = batchRepository;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Ingredient createIngredient(
      @Valid @RequestBody IngredientRequest request, @AuthenticationPrincipal User user) {
    Ingredient ingredient =
        new Ingredient(
            request.name(),
            request.macroBasis(),
            request.proteinPer100g(),
            request.carbsPer100g(),
            request.fatPer100g(),
            request.kcalPer100g());
    ingredient.setNotes(request.notes());
    ingredient.setUser(user);
    return repository.save(ingredient);
  }

  @GetMapping
  public List<Ingredient> listIngredients(@AuthenticationPrincipal User user) {
    return repository.findByUser(user);
  }

  @GetMapping("/{id}")
  public Ingredient getIngredient(@PathVariable Long id, @AuthenticationPrincipal User user) {
    return repository
        .findByIdAndUser(id, user)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found"));
  }

  @PutMapping("/{id}")
  public Ingredient updateIngredient(
      @PathVariable Long id,
      @Valid @RequestBody IngredientRequest request,
      @AuthenticationPrincipal User user) {
    Ingredient ingredientToUpdate =
        repository
            .findByIdAndUser(id, user)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found"));
    ingredientToUpdate.setName(request.name());
    ingredientToUpdate.setMacroBasis(request.macroBasis());
    ingredientToUpdate.setProteinPer100g(request.proteinPer100g());
    ingredientToUpdate.setCarbsPer100g(request.carbsPer100g());
    ingredientToUpdate.setFatPer100g(request.fatPer100g());
    ingredientToUpdate.setKcalPer100g(request.kcalPer100g());
    ingredientToUpdate.setNotes(request.notes());
    return repository.save(ingredientToUpdate);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteIngredient(@PathVariable Long id, @AuthenticationPrincipal User user) {
    Ingredient ingredientToDelete =
        repository
            .findByIdAndUser(id, user)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found"));

    if (batchRepository.existsByIngredient_Id(id)) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "Cannot delete this ingredient because it is used by one or more batches.");
    }

    repository.delete(ingredientToDelete);
  }
}
