package com.prepport.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prepport.entity.Ingredient;
import com.prepport.entity.User;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByUser(User user);

    Optional<Ingredient> findByIdAndUser(Long id, User user);

    boolean existsByIdAndUser(Long id, User user);

    void deleteByIdAndUser(Long id, User user);
}