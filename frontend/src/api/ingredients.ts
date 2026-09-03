import { Ingredient, IngredientForm } from "../types/ingredient";
import { apiJson } from "./client";

export function listIngredients() {
    return apiJson<Ingredient[]>('/api/ingredients', { method: 'GET', auth: true });
}

export function createIngredient(ingredient: IngredientForm) {
    return apiJson<Ingredient>('/api/ingredients', { method: 'POST', body: ingredient , auth: true});
}

export function updateIngredient(id: number, ingredient: IngredientForm) {
    return apiJson<Ingredient>(`/api/ingredients/${id}`, { method: 'PUT', body: ingredient , auth: true});
}

export function deleteIngredient(id: number) {
    return apiJson<void>(`/api/ingredients/${id}`, { method: 'DELETE', auth: true});
}