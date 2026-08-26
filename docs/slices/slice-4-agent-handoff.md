# Agent handoff — Slice 4 (React: ingredients + prep)

**Status:** Complete (Aug 2026). **Next:** [slice-5-agent-handoff.md](./slice-5-agent-handoff.md) ✓ → [PLAN.md](../../PLAN.md) slice 6 (AWS deploy)

---

## Slice 4 outcome

Browser flow works: **register/login → ingredient library → prep session → batches** (raw + cooked weights). Dogfood target: chicken 22.5/0/2.6/120 per 100g raw, session, batch 2146/1600.

---

## What was built

| Area | Notes |
|------|--------|
| `frontend/` | Vite + React 18 + TS; `VITE_API_URL` in `.env` |
| Auth | `Login`, `Register`, `ProtectedRoute`, `token.ts`, logout in `App` |
| `api/client.ts` | `api<T>()` with Bearer, 401 → `clearToken()` |
| `api/ingredients.ts` | `listIngredients()` — shared by Ingredients + PrepSessionDetail |
| CORS | `SecurityConfig.corsConfigurationSource()` for `http://localhost:5173` |
| Pages | `Ingredients`, `PrepSessions`, `PrepSessionDetail` |

---

## Conventions (carry to slice 5)

- API base: `import.meta.env.VITE_API_URL` (no `/api` suffix on base)
- Pairing mode: human builds; agent explains/reviews; minimal scaffold only when asked
- Shell: prefix with `rtk`
- Split load vs submit state on data pages (`isLoadingSession` / `isSubmitting`, etc.)

---

## Known quirks

- Bad login can return **403** with empty body (not 401 JSON) — backend behavior, not frontend bug
- `PrepSessions` renders create form above detail when viewing a session — UX polish deferred
- No React Router yet — detail via `selectedSessionId` in `PrepSessions`

---

## Human opener (historical)

> PrepPort slice 4 — read `docs/slices/slice-4-agent-handoff.md`. Familiarize / scaffold Vite only when I ask.
