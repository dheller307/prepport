import { PortionLogRequest, PortionLogResponse } from "../types/portionLog";
import { apiJson } from "./client";

export function createPortionLog(request: PortionLogRequest) {
    return apiJson<PortionLogResponse>('/api/portion-logs', { method: 'POST', body: request, auth: true });
}

export function listPortionLogs() {
    return apiJson<PortionLogResponse[]>('/api/portion-logs', { method: 'GET', auth: true });
}

export function getPortionLog(id: number) {
    return apiJson<PortionLogResponse>(`/api/portion-logs/${id}`, { method: 'GET', auth: true });
}

export function updatePortionLog(id: number, request: PortionLogRequest) {
    return apiJson<PortionLogResponse>(`/api/portion-logs/${id}`, { method: 'PUT', body: request, auth: true });
}

export function deletePortionLog(id: number) {
    return apiJson<void>(`/api/portion-logs/${id}`, { method: 'DELETE', auth: true });
}