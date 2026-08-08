# Slice 5 — React: portion builder + export UI

**Status:** Not started · **Next after:** [slice 4](./slice-4.md) ✓

**Target:** Jul 28–29 · Complete **product MVP** local flow with slice 2 APIs.

## Done when

- [ ] **Portion builder** — add lines (batch + cooked grams); call `POST /api/portion/calculate` for live macros per line or meal totals
- [ ] **Export panel** — build `PortionExportRequest` lines; `POST /api/portion/export`; display `text/plain`; **copy to clipboard**
- [ ] Chicken check in UI: 200 g cooked from 2146/1600 batch → **≈268 g** `cronometerG` on calculate response
- [ ] Works on a phone-width viewport (Sunday at scale)

## Context (read first)

- **Slice 4 UI:** auth, ingredients, prep sessions, batches — see [slice-4.md](./slice-4.md)
- **Backend:** [slice-2.md](./slice-2.md) — `PortionService`, `YieldCalculator`, DTOs
- **Smoke:** [requests.http](../../requests.http) — calculate + export with Bearer token

## APIs

```
POST   /api/portion/calculate    → JSON PortionCalculateResponse
POST   /api/portion/export       → text/plain body
```

**Calculate:** `{ "batchId", "cookedGrams" }`

**Export:** `{ "lines": [ { "batchId", "cookedGrams" }, ... ] }`

## Suggested work order

1. `types/portion.ts` — mirror backend DTOs
2. `api/client.ts` — add text response helper for export (`response.text()`)
3. Portion builder UI — line list, batch picker, cooked grams, calculate per line
4. Show `cronometerG` + macros from calculate response
5. Export panel + clipboard copy
6. Wire page in `App.tsx` (inside `ProtectedRoute`)
7. Mobile layout pass
8. Dogfood chicken 200 g cooked → ≈268 g `cronometerG`

## Learning split

| Topic | Level | Notes |
|-------|--------|--------|
| `response.text()` vs `.json()` | Quick intro | Export endpoint only |
| Multi-line form state | Quick intro | Array of `{ batchId, cookedGrams }` |
| Clipboard API | Quick intro | `navigator.clipboard.writeText` |
| Live calculate on change | Optional | Debounce or button-triggered |
| CSS mobile viewport | Quick intro | slice 5 polish |

**Agent may scaffold:** types, `apiText`, folder layout — **you** own page and wiring.

## Not in scope

- CSV export, meal templates (slices 6–7), deploy (slice 8)
- Replacing backend entities with response DTOs

## Local dev

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```

Agent handoff: [slice-5-agent-handoff.md](./slice-5-agent-handoff.md)
