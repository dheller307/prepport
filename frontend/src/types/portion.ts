export interface PortionCalculateRequest {
    batchId: number
    cookedGrams: number
}

export interface PortionCalculateResponse {
    batchId: number
    ingredientName: string
    cronometerG: number
    proteinG: number
    fatG: number
    carbsG: number
    kcal: number
}

export interface PortionExportRequest {
    lines: PortionCalculateRequest[]
}