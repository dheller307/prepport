import type {
  CreatePrepSessionRequest,
  PrepSession,
} from "../types/prepSession";
import { apiJson } from "./client";

export function listPrepSessions() {
  return apiJson<PrepSession[]>("/api/prep-sessions");
}

export function getPrepSession(id: number) {
  return apiJson<PrepSession>(`/api/prep-sessions/${id}`);
}

export function createPrepSession(request: CreatePrepSessionRequest) {
  return apiJson<PrepSession>("/api/prep-sessions", {
    method: "POST",
    body: request,
  });
}

export function updatePrepSession(
  id: number,
  request: CreatePrepSessionRequest,
) {
  return apiJson<PrepSession>(`/api/prep-sessions/${id}`, {
    method: "PUT",
    body: request,
  });
}

export function deletePrepSession(id: number) {
  return apiJson<void>(`/api/prep-sessions/${id}`, {
    method: "DELETE",
  });
}
