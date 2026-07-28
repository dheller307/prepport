# Slice 4 — React: ingredients + prep session

**Status:** Not started · **Next after:** [slice-2](./slice-2.md) ✓

**Target:** Jul 28–29 (ship with [slice 5](./slice-5.md)) · First UI on top of the slice 2 API; Sunday weigh-in flow without Postman.

## Done when

- [ ] `frontend/` — Vite + React 18 + TypeScript; `npm run dev` talks to backend on `http://localhost:8080`
- [ ] **Auth UI** — register + login; JWT stored client-side; `Authorization: Bearer` on API calls
- [ ] **Ingredients** — list, add form (name, `macroBasis`, P/C/F/kcal per 100g, notes); optional edit/delete
- [ ] **Prep session** — create session (date + notes); view session with batches
- [ ] **Batches** — add batch to session: pick ingredient, `rawWeightG` + `cookedWeightG` (both required)
- [ ] Backend **CORS** allows Vite dev origin (e.g. `http://localhost:5173`) with credentials/headers as needed
- [ ] Mobile-friendly layout basics (readable at the scale; polish in slice 5)

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

## Suggested work order

1. Scaffold `frontend/` (Vite React TS template); env var for API base URL (`VITE_API_URL=http://localhost:8080`).
2. Small **API client** — `fetch` wrapper: attach token, JSON parse, surface 401 → logout/login.
3. **Auth pages** — register, login, simple protected route guard (redirect if no token).
4. **Ingredients page** — `GET /api/ingredients`, form → `POST /api/ingredients`.
5. **Prep sessions** — list/create; detail view loads `GET /api/prep-sessions/{id}` (includes batches).
6. **Add batch form** on session detail — ingredient dropdown from library, raw + cooked weights → `POST .../batches`.
7. **CORS** in `SecurityConfig` (or `@CrossOrigin` on controllers) for local dev.
8. Dogfood: recreate Sunday chicken in the browser (ingredient + session + batch 2146/1600).

## Learning split

| Topic | Level | Notes |
|-------|--------|--------|
| React components + `useState` | Short prep / quick intro | One page at a time |
| `useEffect` + data fetch | Quick intro | Load list on mount; loading/error states |
| TypeScript interfaces for API shapes | Quick intro | Mirror backend JSON; optional shared types later |
| Vite env (`import.meta.env`) | Quick intro | API base URL |
| JWT in browser | Quick intro | `localStorage` OK for local MVP; not production hardening |
| CORS | Quick intro | Browser blocks cross-origin until backend permits Vite origin |
| React Router (optional) | Defer or quick intro | `/login`, `/ingredients`, `/prep`, `/prep/:id` |
| CSS / layout | Quick intro | Plain CSS or minimal library; mobile-first |

**Agent may scaffold:** Vite project, folder layout, starter `api.ts` — **you** own pages and wiring.

## Suggested `frontend/` layout (create when scaffolding)

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── api/client.ts          # fetch + auth header
│   ├── auth/                  # Login, Register, token helpers
│   ├── pages/                 # Ingredients, PrepSessions, PrepSessionDetail
│   └── types/                 # Ingredient, PrepSession, Batch, ...
```

## Not in scope (slice 5 or later)

- Portion builder, live macro preview, export copy button — [slice 5](./slice-5.md)
- Meal / ingredient templates (slices 6–7)
- Deploy, production auth hardening — slice 8
- Replacing entities with dedicated response DTOs on backend

## Local dev

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run

cd frontend && npm install && npm run dev
```

Backend: `http://localhost:8080` · Frontend (Vite default): `http://localhost:5173`
