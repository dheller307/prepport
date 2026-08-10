# Agent handoff — Slice 5 (portion builder + export UI)

**Status:** Complete (Aug 2026). **Next:** [PLAN.md](../../PLAN.md) — slice 8 (deploy) + slice 9 (README/resume)

---

## Slice 5 outcome

Browser **product MVP** local flow works: **ingredient → prep session → batch → portion lines → calculate macros → export Cronometer text → copy**. Dogfood: 200 g cooked chicken from 2146/1600 batch → `cronometerG` ≈ **268**.

---

## What was built

| Area | Notes |
|------|--------|
| `types/portion.ts` | Request/response DTO mirrors |
| `api/client.ts` | Private `request()`; `apiJson` + `apiText` |
| `api/portion.ts` | `calculatePortion`, `exportPortion` |
| `pages/PortionBuilder.tsx` | Lines + results arrays; batch flat-list picker; export + clipboard |
| `index.css` | `.portion-line`, `.export-pre` for mobile |
| `App.tsx` | `<PortionBuilder />` stacked below prep sessions |

---

## Frontend state (slice 5 complete)

```
frontend/src/
├── api/client.ts          # apiJson + apiText (shared request helper)
├── api/ingredients.ts
├── api/portion.ts
├── pages/Ingredients.tsx
├── pages/PrepSessions.tsx
├── pages/PrepSessionDetail.tsx
├── pages/PortionBuilder.tsx
├── types/portion.ts (+ ingredient, prepSession, batch, auth)
└── App.tsx                # ProtectedRoute; Ingredients + PrepSessions + PortionBuilder
```

---

## Backend (slice 2 — unchanged)

```
POST /api/portion/calculate   → JSON PortionCalculateResponse
POST /api/portion/export      → text/plain body
```

**Chicken check:** 200 g cooked from batch 2146 raw / 1600 cooked → `cronometerG` ≈ **268.25**, protein ≈ **60.4**.

---

## Conventions (carry to slice 8)

- API base: `VITE_API_URL` · Bearer on protected routes
- Pairing mode: human builds; agent explains/reviews; minimal scaffold only when asked
- Shell: `rtk` prefix
- Split load vs submit/calculate/export errors on data pages

---

## Known quirks / deferred polish

- `key={index}` on portion lines — fine until reordering lines
- Global `isCalculating` disables all Calculate buttons while one request runs
- No React Router — stacked pages in `App.tsx`
- Meal templates, CSV, per-line debounced calculate — slices 6–7 (cut if behind)

---

## Human opener (historical)

> PrepPort slice 5 — read `docs/slices/slice-5-agent-handoff.md`. I finished slice 4 (ingredients + prep + batches). Let's start with [types + apiText / portion builder / batch picker / …].
