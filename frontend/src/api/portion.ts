import { apiJson, apiText } from "./client";
import { PortionCalculateRequest, PortionCalculateResponse, PortionExportRequest } from "../types/portion";

export async function calculatePortion(request: PortionCalculateRequest) {
    const response = await apiJson<PortionCalculateResponse>('/api/portion/calculate', { method: 'POST', body: request, auth: true });
    return response;
}

export async function exportPortion(request: PortionExportRequest) {
    const response = await apiText('/api/portion/export', { method: 'POST', body: request, auth: true });
    return response;
}