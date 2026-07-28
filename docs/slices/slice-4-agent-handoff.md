# Agent handoff — Slice 4 (React: ingredients + prep)

**For the next Cursor agent.** Human continues **slice 4** (and overlaps **slice 5** per PLAN).

---

## Your instructions

1. **Read** [slice-4.md](./slice-4.md), [PLAN.md](../../PLAN.md) (slices 4–5), [requests.http](../../requests.http).
2. **Pairing mode by default** — human builds; explain concepts, review diffs, scaffold Vite/`api.ts` only when asked.
3. Do **not** silently build the full React app unless explicitly requested.
4. **No `frontend/` yet** in repo — slice 4 starts from scaffold.

---

## Read first (order)

1. [README.md](../../README.md) — status and quick links  
2. [docs/slices/slice-4.md](./slice-4.md) — done-when, APIs, work order  
3. [docs/slices/slice-5.md](./slice-5.md) — portion/export UI (after slice 4)  
4. [docs/slices/slice-2.md](./slice-2.md) — portion APIs (slice 5)  
5. [docs/slices/slice-1b.md](./slice-1b.md) — JWT behavior  
6. [requests.http](../../requests.http) — canonical API smoke flow  

---

## Slice 4 goal

Browser flow: **register/login → ingredient library → prep session → batches** (raw + cooked weights). Portion/export UI is **slice 5**.

---

## Backend state (slice 2 complete)

| Area | Status |
|------|--------|
| JWT auth + user-scoped CRUD | ✓ |
| `POST /api/portion/calculate`, `POST /api/portion/export` | ✓ (slice 5 UI) |
| **CORS for Vite dev** | **Not configured** — likely needed in slice 4 |
| **`frontend/`** | **Missing** — create in slice 4 |

---

## Conventions

- API base: `http://localhost:8080` (or `VITE_API_URL`)  
- Token: `Authorization: Bearer <jwt>` on protected routes  
- Ingredient `macroBasis`: `RAW` \| `COOKED`  
- MVP batches: always `rawWeightG` + `cookedWeightG`  
- Shell: prefix with `rtk` per workspace rules  

---

## Human opener (suggested)

> PrepPort slice 4 — read `docs/slices/slice-4-agent-handoff.md`. Familiarize / scaffold Vite only when I ask.
