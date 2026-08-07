import { Ingredient } from "./ingredient"

export interface Batch {
    id?: number
    ingredient: Ingredient
    createdAt?: string
    rawWeightG: number
    cookedWeightG: number
}

export interface CreateBatchRequest {
    ingredientId: number
    rawWeightG: number
    cookedWeightG: number
}