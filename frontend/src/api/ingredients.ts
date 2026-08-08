import { Ingredient } from "../types/ingredient";
import { api } from "./client";

export async function listIngredients() {
    const response = await api<Ingredient[]>('/api/ingredients', { method: 'GET', auth: true });
    return response;
}