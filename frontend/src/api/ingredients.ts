import { Ingredient } from "../types/ingredient";
import { apiJson } from "./client";

export async function listIngredients() {
    const response = await apiJson<Ingredient[]>('/api/ingredients', { method: 'GET', auth: true });
    return response;
}