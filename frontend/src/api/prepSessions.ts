import type {
  CreatePrepSessionRequest,
  PrepSessionDeletionImpact,
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

export function getPrepSessionDeletionImpact(id: number) {
  return apiJson<PrepSessionDeletionImpact>(
    `/api/prep-sessions/${id}/deletion-impact`,
  );
}

export function deletePrepSession(id: number, deleteAssociatedMeals = false) {
  const query = deleteAssociatedMeals ? "?deleteAssociatedMeals=true" : "";

  return apiJson<void>(`/api/prep-sessions/${id}${query}`, {
    method: "DELETE",
  });
}
