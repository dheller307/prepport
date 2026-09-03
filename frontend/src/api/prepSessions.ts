import type { PrepSession, CreatePrepSessionRequest } from "../types/prepSession";
import { apiJson } from "./client";

export function listPrepSessions() {
    return apiJson<PrepSession[]>("/api/prep-sessions", {
        method: "GET",
        auth: true,
    });
  }
export function createPrepSession(request: CreatePrepSessionRequest) {
    return apiJson<PrepSession>("/api/prep-sessions", {
        method: "POST",
        body: request,
        auth: true,
});
}
export function updatePrepSession(id: number, request: CreatePrepSessionRequest) {
    return apiJson<PrepSession>(`/api/prep-sessions/${id}`, {
        method: "PUT",
        body: request,
        auth: true,
    });
}
export function deletePrepSession(id: number) {
    return apiJson<void>(`/api/prep-sessions/${id}`, {
        method: "DELETE",
        auth: true,
    });
}