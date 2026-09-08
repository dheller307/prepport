import { apiJson, apiText } from "./client";
import type {
  PortionCalculateRequest,
  PortionCalculateResponse,
  PortionExportRequest,
} from "../types/portion";

export function calculatePortion(request: PortionCalculateRequest) {
  return apiJson<PortionCalculateResponse>("/api/portion/calculate", {
    method: "POST",
    body: request,
  });
}

export function exportPortion(request: PortionExportRequest) {
  return apiText("/api/portion/export", {
    method: "POST",
    body: request,
  });
}
