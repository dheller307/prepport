import type { PortionCalculateRequest } from "./portion";

export type PortionLogLineRequest = PortionCalculateRequest;

export interface PortionLogRequest {
  name: string;
  portionDate: string; // YYYY-MM-DD
  lines: PortionLogLineRequest[];
}

export interface PortionLogLineResponse {
  batchId: number;
  prepSessionId: number;
  ingredientName: string;
  cookedGrams: number;
  cronometerG: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  kcal: number;
}

export interface PortionLogResponse {
  id: number;
  name: string;
  portionDate: string;
  createdAt: string;
  lines: PortionLogLineResponse[];
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalKcal: number;
}
