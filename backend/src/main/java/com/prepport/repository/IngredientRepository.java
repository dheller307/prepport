package com.prepport.repository;

import com.prepport.entity.Ingredient;
import com.prepport.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
  List<Ingredient> findByUser(User user);

  Optional<Ingredient> findByIdAndUser(Long id, User user);

  boolean existsByIdAndUser(Long id, User user);
}
