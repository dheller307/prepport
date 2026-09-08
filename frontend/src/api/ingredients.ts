import type { Ingredient, IngredientForm } from "../types/ingredient";
import { apiJson } from "./client";

export function listIngredients() {
  return apiJson<Ingredient[]>("/api/ingredients");
}

export function createIngredient(ingredient: IngredientForm) {
  return apiJson<Ingredient>("/api/ingredients", {
    method: "POST",
    body: ingredient,
  });
}

export function updateIngredient(id: number, ingredient: IngredientForm) {
  return apiJson<Ingredient>(`/api/ingredients/${id}`, {
    method: "PUT",
    body: ingredient,
  });
}

export function deleteIngredient(id: number) {
  return apiJson<void>(`/api/ingredients/${id}`, {
    method: "DELETE",
  });
}
