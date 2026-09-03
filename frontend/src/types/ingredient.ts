export interface Ingredient {
    id?: number
    macroBasis: 'RAW' | 'COOKED'
    name: string
    proteinPer100g: number
    carbsPer100g: number
    fatPer100g: number
    kcalPer100g: number
    notes?: string
    createdAt?: string
}

export type IngredientForm = Omit<Ingredient, 'id' | 'createdAt'>