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
}

export interface PortionLogResponse {
    id: number;
    name: string;
    portionDate: string;
    createdAt: string;
    lines: PortionLogLineResponse[];
}