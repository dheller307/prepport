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

import com.prepport.repository.IngredientRepository;
import com.prepport.entity.Ingredient;
import com.prepport.entity.User;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {
    private final IngredientRepository repository;

    public IngredientController(IngredientRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ingredient createIngredient(@RequestBody Ingredient ingredient, @AuthenticationPrincipal User user) {
        ingredient.setUser(user);
        return repository.save(ingredient);
    }

    @GetMapping
    public List<Ingredient> listIngredients(@AuthenticationPrincipal User user) {
        return repository.findByUser(user);
    }

    @GetMapping("/{id}")
    public Ingredient getIngredient(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found"));
    }

    @PutMapping("/{id}")
    public Ingredient updateIngredient(@PathVariable Long id, @RequestBody Ingredient ingredient, @AuthenticationPrincipal User user) {
        Ingredient ingredientToUpdate = repository.findByIdAndUser(id, user).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found"));
        ingredientToUpdate.setName(ingredient.getName());
        ingredientToUpdate.setMacroBasis(ingredient.getMacroBasis());
        ingredientToUpdate.setProteinPer100g(ingredient.getProteinPer100g());
        ingredientToUpdate.setCarbsPer100g(ingredient.getCarbsPer100g());
        ingredientToUpdate.setFatPer100g(ingredient.getFatPer100g());
        ingredientToUpdate.setKcalPer100g(ingredient.getKcalPer100g());
        ingredientToUpdate.setNotes(ingredient.getNotes());
        return repository.save(ingredientToUpdate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIngredient(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (!repository.existsByIdAndUser(id, user)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ingredient not found");
        }
        repository.deleteByIdAndUser(id, user);
    }
}