import type { Batch, CreateBatchRequest } from "../types/batch";
import { apiJson } from "./client";

export function createBatch(sessionId: number, request: CreateBatchRequest) {
  return apiJson<Batch>(`/api/prep-sessions/${sessionId}/batches`, {
    method: "POST",
    body: request,
  });
}

export function updateBatch(
  sessionId: number,
  batchId: number,
  request: CreateBatchRequest,
) {
  return apiJson<Batch>(`/api/prep-sessions/${sessionId}/batches/${batchId}`, {
    method: "PUT",
    body: request,
  });
}

export function deleteBatch(sessionId: number, batchId: number) {
  return apiJson<void>(`/api/prep-sessions/${sessionId}/batches/${batchId}`, {
    method: "DELETE",
  });
}
