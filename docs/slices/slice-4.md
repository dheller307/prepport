# Slice 4 — React: ingredients + prep session

**Status:** Complete (Aug 2026) · **Next:** [slice 5](./slice-5.md) ✓ → [PLAN.md](../../PLAN.md) slice 6 (AWS deploy)

**Target:** Jul 28–29 (ship with [slice 5](./slice-5.md)) · First UI on top of the slice 2 API; Sunday weigh-in flow without Postman.

## Done when

- [x] `frontend/` — Vite + React 18 + TypeScript; `npm run dev` talks to backend on `http://localhost:8080`
- [x] **Auth UI** — register + login; JWT stored client-side; `Authorization: Bearer` on API calls
- [x] **Ingredients** — list, add form (name, `macroBasis`, P/C/F/kcal per 100g, notes); optional edit/delete (deferred)
- [x] **Prep session** — create session (date + notes); view session with batches
- [x] **Batches** — add batch to session: pick ingredient, `rawWeightG` + `cookedWeightG` (both required)
- [x] Backend **CORS** allows Vite dev origin (`http://localhost:5173`) — `SecurityConfig.corsConfigurationSource()`
- [x] Mobile-friendly layout basics (`index.css` max-width); heavier polish → slice 5

## Context (read first)

- **Backend running:** [requests.http](../../requests.http) — full auth → ingredient → prep session → batch → portion flow
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login` → `{ "token": "..." }`; all `/api/**` except auth + `/health` need Bearer token
- **Slice 2 APIs exist but UI is slice 5:** `POST /api/portion/calculate`, `POST /api/portion/export` — do not block slice 4 on these
- **Cronometer chicken smoke macros (per 100g raw):** 22.5 P / 0 C / 2.6 F / 120 kcal — see [slice-2](./slice-2.md)
- **Entities over the wire:** JSON uses camelCase (`macroBasis`, `proteinPer100g`, `sessionDate`, `rawWeightG`, …)

## Existing backend APIs (slice 4 uses)

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/ingredients
POST   /api/ingredients
GET    /api/ingredients/{id}
PUT    /api/ingredients/{id}
DELETE /api/ingredients/{id}

GET    /api/prep-sessions
POST   /api/prep-sessions
GET    /api/prep-sessions/{id}
POST   /api/prep-sessions/{id}/batches
```

Batch create body (`CreateBatchRequest`): `{ "ingredientId", "rawWeightG", "cookedWeightG" }`.

## Frontend delivered (Aug 2026)

```
frontend/src/
├── api/
│   ├── client.ts           # fetch wrapper + JWT
│   └── ingredients.ts      # listIngredients()
├── auth/
│   ├── Login.tsx, Register.tsx, token.ts, ProtectedRoute.tsx
├── pages/
│   ├── Ingredients.tsx     # GET list + POST add
│   ├── PrepSessions.tsx    # list/create; View → detail
│   └── PrepSessionDetail.tsx  # GET session, batch form, POST batch
├── types/
│   ├── auth.ts, ingredient.ts, prepSession.ts, batch.ts
└── App.tsx                 # ProtectedRoute; Ingredients + PrepSessions stacked
```

**Patterns established:** split `loadingError` / `submissionError`; separate `isLoading` / `isSubmitting`; object form state; `listIngredients()` shared helper.

**Deferred polish:** React Router, ingredient edit/delete, prep list UX when detail open, layout/CSS (slice 5).

## Not in scope (slice 5 or later)

- Portion builder, live macro preview, export copy button — [slice 5](./slice-5.md)
- Meal / ingredient templates (slices 6–7)
- Deploy, production auth hardening — slice 6
- Replacing entities with dedicated response DTOs on backend

## Local dev

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run

cd frontend && npm install && npm run dev
```

Backend: `http://localhost:8080` · Frontend (Vite default): `http://localhost:5173`
