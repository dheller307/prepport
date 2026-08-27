# Slice 7 — UI / UX (React Router + flow)

**Status:** Not started · **Next after this:** [slice 8](./slice-8.md) (GitHub + README) — file may not exist yet; see [PLAN.md](../../PLAN.md)

**Prerequisite:** Slice **6** shipped — live demo at **https://prepport.duckdns.org** (Lightsail + Nginx + HTTPS).

Agent handoff: [slice-7-agent-handoff.md](./slice-7-agent-handoff.md)

## Done when

- [ ] **React Router** — separate routes (not one stacked page); nav between main screens
- [ ] **Auth screen** — PrepPort title and clear login vs register context (not a bare form)
- [ ] **Page copy** — each main screen has a short “what this is for” description (recruiter-readable)
- [ ] **Number inputs** — no stale leading zero when typing (e.g. `0100` when entering `100`)
- [ ] **Portion builder** — new prep sessions / batches appear without a manual full-page refresh
- [ ] **Structure-first polish** — spacing and layout readable on phone-width; no heavy branding yet
- [ ] **Live demo updated** — rebuild `frontend` with `VITE_API_URL=https://prepport.duckdns.org`, `scp` + copy to `/var/www/prepport`
- [ ] Sunday smoke still works on the live URL (register → ingredient → batch → portion ≈268 g → export)

## Context (read first)

- **Product MVP** works end-to-end locally and on AWS. Slice 7 is **frontend-only** — no new APIs unless a tiny fix is unavoidable.
- **Current UI pain** (from live demo dogfooding, Aug 2026):
  - Login/register is bare — no app header or login/register heading
  - All pages stacked in `App.tsx` — hard to use on Sunday at the scale
  - Workflow feels odd; may improve with pages + copy — revisit after router, don’t redesign backend flow yet
  - Portion builder does not pick up new prep sessions until refresh (`useEffect` runs once on mount)
  - Number fields show ugly leading zeros (`0100`) — cosmetic but distracting
  - Overall look is utilitarian; **save colors/branding until structure is in place**
- **Pairing:** human implements; agent explains, reviews, unblocks. Shell: `rtk`. Do not commit unless asked.
- **Deploy:** same as slice 6 Phase 5 — local build + `scp` `dist`; Nginx `try_files` already supports SPA routes.

## Current frontend shape

```
App.tsx
├── ProtectedRoute fallback → LoginForm / RegisterForm (toggle, no header)
└── ProtectedRoute children → h1 + Logout + Ingredients + PrepSessions + PortionBuilder (all visible)
```

`PortionBuilder` loads prep sessions in `useEffect(..., [])` — stale when user adds batches on another “page” that was on the same screen.

Number inputs use `type="number"` + `value={number}` + `Number(e.target.value)` in `Ingredients.tsx`, `PrepSessionDetail.tsx`, `PortionBuilder.tsx`.

## Target routes (suggested)

| Path | Screen | Purpose |
|------|--------|---------|
| `/login` | Login | Sign in |
| `/register` | Register | Create account |
| `/ingredients` | Ingredients | Cronometer foods you prep with (macros per 100 g) |
| `/prep` | Prep sessions | Sunday cook sessions + batches (raw/cooked weights) |
| `/portion` | Portion builder | Build portions from this week’s batches → export |

Optional later: `/prep/:id` for session detail if `PrepSessions` + detail are split.

**Layout:** shared shell for authenticated routes — app title, nav links, logout. Auth routes — centered card with PrepPort + “Log in” / “Create account”.

## Work order (structure before cosmetics)

### Phase 1 — Router + layout

1. Add `react-router-dom` (v6).
2. `BrowserRouter`, `Routes`, `Route` in `App.tsx` (or `routes.tsx`).
3. `ProtectedRoute` redirects to `/login` when no token; preserve intended path optional.
4. `AppLayout` — nav: Ingredients · Prep · Portion · Logout.
5. Nginx already has `try_files $uri /index.html` — client routes work after deploy.

**Agent may scaffold:** route table, `AppLayout`, redirect from `/` → `/ingredients` or `/prep`.

### Phase 2 — Auth + page copy

1. Auth routes: PrepPort header + subtitle; separate `/login` and `/register` (replace toggle-only UX or keep link between them).
2. Each main page: `<h1>` + 1–2 sentence description (see copy seeds below).
3. Mobile: nav stacks or horizontal scroll; main column max-width.

**Copy seeds (edit to your voice):**

| Page | Description seed |
|------|-------------------|
| Ingredients | “Foods you meal-prep with. Add macros per 100 g from Cronometer (raw or cooked basis).” |
| Prep | “Sunday cook sessions. Create a session, then add batches with raw and cooked weights for yield.” |
| Portion | “Build portions from this week’s batches. Calculate macros, then copy export text for Cronometer.” |

### Phase 3 — Number input fix

**Problem:** controlled `value={0}` + typing produces display quirks (`0100`).

**Approach (pick one, stay consistent):**

- Store form fields as **strings** in state; parse to number on submit/API call, OR
- Use `value={field === 0 ? '' : field}` for optional empty display, OR
- `type="text"` + `inputMode="decimal"` + validation

Touch: `Ingredients.tsx`, `PrepSessionDetail.tsx`, `PortionBuilder.tsx`.

### Phase 4 — Portion builder freshness

When user lands on `/portion`, **reload prep sessions** (and batches if needed):

- `useEffect` on mount is enough if portion is its own route (navigating away and back re-runs it), OR
- `useLocation()` key / refetch when pathname is `/portion`, OR
- shared data hook later (slice 9) — not required now

Confirm: create prep session + batch on `/prep` → go to `/portion` → new batch appears in dropdown **without** browser refresh.

### Phase 5 — Light visual cleanup (after Phases 1–4)

- Consistent page padding, form spacing, button styles in `index.css`
- No logo/color system required — “clean and simple”
- Phone-width smoke on live URL

**Defer:** brand colors, illustrations, dark mode, meal templates (slice 9).

## Learning split

| Topic | Level | Notes |
|-------|--------|--------|
| React Router v6 | Quick intro | `Routes`, `Route`, `Navigate`, layout routes |
| SPA + Nginx | Quick intro | `try_files` → `index.html` for deep links |
| Controlled number inputs | Quick intro | string vs number state |
| Refetch on navigation | Quick intro | mount vs shared state |

## Deploy reminder (after UI changes)

```bash
# laptop
cd frontend
VITE_API_URL=https://prepport.duckdns.org npm run build
scp -i ~/.ssh/lightsail-us-east-1.pem -r dist ubuntu@3.225.15.117:~/prepport-dist-new

# server
sudo cp -r ~/prepport-dist-new/* /var/www/prepport/
sudo chown -R www-data:www-data /var/www/prepport
```

Use a **fresh** scp target folder each time (avoid nested `prepport-dist/dist` from slice 6).

## Not in scope

- README rewrite, GitHub pin, resume bullets (**slice 8**)
- Meal/ingredient templates, USDA (**slice 9**)
- Backend API changes
- New AWS resources

## Local dev

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev   # VITE_API_URL=http://localhost:8080 in frontend/.env
```
