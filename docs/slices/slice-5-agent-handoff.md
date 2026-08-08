# Agent handoff — Slice 5 (portion builder + export UI)

**For the next Cursor agent.** Human continues **slice 5** after [slice 4](./slice-4.md) ✓

---

## Your instructions

1. **Read** [slice-5.md](./slice-5.md), [slice-2.md](./slice-2.md), [requests.http](../../requests.http) (portion section).
2. **Pairing mode by default** — human builds; explain concepts, review diffs, scaffold types/`api` helpers only when asked.
3. Do **not** silently build the full portion UI unless explicitly requested.
4. **Slice 4 UI is done** — extend `frontend/`, don't rewrite auth/ingredients/prep.

---

## Read first (order)

1. [slice-5.md](./slice-5.md) — done-when, APIs, work order
2. [slice-2.md](./slice-2.md) — calculate/export behavior, chicken numbers
3. [requests.http](../../requests.http) — `POST /api/portion/calculate` and `/export`
4. [slice-4-agent-handoff.md](./slice-4-agent-handoff.md) — frontend patterns already in use

---

## Slice 5 goal

Complete **product MVP** in the browser: build portion lines (batch + cooked grams), see live macros, export Cronometer copy-paste text.

**Not in scope:** deploy, meal templates, CSV, backend DTO refactors.

---

## Backend (slice 2 — ready)

```
POST /api/portion/calculate   → JSON PortionCalculateResponse
POST /api/portion/export      → text/plain body
```

**Calculate request:** `{ "batchId": number, "cookedGrams": number }`

**Calculate response:** `batchId`, `ingredientName`, `cronometerG`, `proteinG`, `fatG`, `carbsG`, `kcal`

**Export request:** `{ "lines": [ { batchId, cookedGrams }, ... ] }`

**Chicken check:** 200 g cooked from batch 2146 raw / 1600 cooked → `cronometerG` ≈ **268.25**, protein ≈ **60.4** (see requests.http).

---

## Frontend state (slice 4 complete)

```
frontend/src/
├── api/client.ts          # JSON only today — export needs text/plain handling
├── api/ingredients.ts
├── pages/Ingredients.tsx
├── pages/PrepSessions.tsx
├── pages/PrepSessionDetail.tsx
├── types/ingredient.ts, prepSession.ts, batch.ts, auth.ts
└── App.tsx                # ProtectedRoute; Ingredients + PrepSessions stacked
```

**Batch ids for portion lines** come from prep sessions the user already created — UI must let user pick a batch (from a session) + enter `cookedGrams`.

---

## Likely slice 5 work order

1. **Types** — `types/portion.ts`: `PortionCalculateRequest`, `PortionCalculateResponse`, `PortionExportRequest` (mirror backend records).
2. **API** — extend `api/client.ts` with `apiText()` or similar for `POST /api/portion/export` (`response.text()`, not `.json()`).
3. **Portion builder page** — lines array in state; per line: batch selector + cooked grams; call calculate on change or button.
4. **Display macros** — show `cronometerG` + P/C/F/kcal per line (and optional meal totals).
5. **Export panel** — `POST /api/portion/export` with all lines; show text; **copy to clipboard** (`navigator.clipboard.writeText`).
6. **Wire in App** — new `<PortionBuilder />` (or name of choice) inside `ProtectedRoute`.
7. **Mobile pass** — readable at phone width (slice 5 done-when).
8. **Dogfood** — chicken 200 g cooked → verify ≈268 g in UI.

---

## Patterns to reuse from slice 4

- `api<T>()` + `try/catch/finally` + split load/submit errors
- `listIngredients()` pattern → consider `api/prepSessions.ts` or fetch batches for dropdowns
- Object state for multi-field forms; `useEffect` for initial data load
- No React Router required — can add later

---

## `api/client.ts` note

Export returns **`text/plain`**, not JSON. Default `response.json()` will break. Options:

- `apiText(path, options)` helper, or
- `responseType: 'text'` flag on existing client

Calculate stays JSON — use existing `api<PortionCalculateResponse>()`.

---

## Batch picker UX (agent should discuss with human)

User needs to choose a **batch** (not just ingredient). Options:

- Dropdown of batches from a selected prep session, or
- Flat list: `"Chicken — Jul 20 session — batch #3"`, or
- Portion UI on `PrepSessionDetail` (add portion section below batches)

Pick simplest path that ships; slice 5 doesn't mandate router.

---

## Conventions

- API base: `VITE_API_URL` · Bearer on protected routes
- Shell: `rtk` prefix
- Minimal diff; one page/feature at a time

---

## Human opener (suggested)

> PrepPort slice 5 — read `docs/slices/slice-5-agent-handoff.md`. I finished slice 4 (ingredients + prep + batches). Let's start with [types + apiText / portion builder / batch picker / …].
