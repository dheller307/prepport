# Slice 7 — UI / UX (recruiter-ready workflow)

**Status:** In progress · **Next:** [slice 8](./slice-8.md) (GitHub + README).

**Prerequisite:** Slice **6** is live at **https://prepport.duckdns.org**.

Agent handoff: [slice-7-agent-handoff.md](./slice-7-agent-handoff.md)

## Goal

Make PrepPort easy to understand during a one-time recruiter demo and pleasant to
use during Sunday prep. The screen hierarchy is:

```text
Ingredients
Prep session (named + dated)
  └── Batches
       └── Saved portions taken from that batch
Portion builder (calculate → save → copy logging text)
```

## Done when

- [x] Separate routes, shared navigation, auth context, and page descriptions
- [ ] Leading-zero behavior is fixed for every numeric form field
- [ ] Ingredients support list, details, add, edit, and delete
- [ ] Prep sessions have a name, list/detail/create/edit/delete flow
- [ ] Batches support add/edit/delete inside their prep-session detail view
- [ ] Saved multi-line portions show batch history and derived available cooked grams
- [ ] The portion builder labels cooked grams, validates availability, saves a named/date-stamped meal, and refreshes data on navigation
- [ ] A public `/how-it-works` page explains the workflow
- [ ] Forms/lists/actions work at phone width without a branding overhaul
- [ ] The frontend is deployed and the live Sunday smoke flow passes

## Mini-sections — build in order

### 7.1 — Finish the existing foundation

**Why:** Router/layout work is already committed; finish its loose ends before
building new screens.

- Fix numeric empty-state display in `Ingredients.tsx`, `PrepSessionDetail.tsx`,
  and `PortionBuilder.tsx`.
- Confirm navigating from `/prep` to `/portion` refetches current sessions/batches.
- Add authenticated navigation and public access to `/how-it-works`.

**Check:** type `100` into an empty numeric input; it must not become `0100`.

### 7.2 — Ingredient library

**Why:** browsing existing foods should come before creating another one.

- Show ingredient rows/cards first: name, macro basis, key macros, expandable
  notes/details, Edit, and Delete.
- Place the form behind “Add ingredient”; reuse it for edit with prefilled values.
- Wire the existing `GET`, `POST`, `PUT`, and `DELETE /api/ingredients` APIs.
- Confirm deletion before sending the request.

**Check:** create, edit, inspect, and delete an ingredient without reloading.

### 7.3 — Named prep sessions

**Why:** dates alone do not describe a user’s prep, and the current screen mixes
the list, create form, and batch form.

- Add required `name` to the prep-session data model and create/update API DTOs.
- List sessions newest first with name, date, batch count, Open, Edit, and Delete.
- Put “New prep session” behind an explicit action; reuse its form for edit.
- Move session detail to a deliberate open state or `/prep/:id` route.

**Check:** “Labor Day prep — 2026-09-03” is clearly distinguishable from another
session on the same date.

### 7.4 — Batches within a session

**Why:** a batch is part of one cooking event, so keep it nested rather than adding
a standalone batch page.

- Add scoped batch `PUT` and `DELETE` endpoints under its parent prep session.
- In session detail, show batch rows/cards with ingredient, raw/cooked weights,
  yield, available cooked grams, Edit, and Delete.
- Show the add/edit batch form vertically with labels and hints.
- Make each batch history collapsible so saved portions do not crowd the page.

**Check:** edit a batch, delete a batch, and expand/collapse its history.

### 7.5 — Saved portions and available batch weight

**Why:** saving portions turns the calculator into a useful record of what was
taken from each batch.

- Add `PortionLog` (user, name, date) and `PortionLogLine` (portion log, batch,
  cooked grams) with CRUD endpoints.
- Calculate availability server-side:
  `batch.cookedWeightG − sum(saved portion-log-line cooked grams)`.
- Validate on create/update that a portion cannot exceed availability; exclude the
  record currently being edited from that calculation.
- Do not store mutable remaining grams. Edit/delete must automatically restore
  availability.

**Check:** save a two-line “Tuesday lunch,” see both batch histories update, then
edit/delete it and confirm grams return.

### 7.6 — Portion builder finish

**Why:** the calculator already works; make its inputs and result flow self-explanatory.

- Label every cooked-grams input and show the selected batch’s available amount.
- Add portion-log name/date and “Save portion.”
- Keep per-line calculation and copy-to-clipboard export.
- Use tracker-neutral copy such as “Copy logging text for your nutrition tracker.”
  Explain raw-equivalent grams where relevant.

**Check:** calculate chicken ≈268 g raw equivalent for a 200 g cooked portion,
save it, then copy the export text.

### 7.7 — Light visual polish, tests, and deploy

- Standardize form spacing, action rows, cards/lists, error states, confirmation,
  and collapse controls in `index.css`.
- Add tests for session naming, batch ownership/edit/delete, portion availability,
  multi-batch saving, and restoring amounts after edit/delete.
- Run the live smoke flow: register → ingredient CRUD → named session → batch CRUD
  → saved portion → availability/history → export.
- Rebuild with `VITE_API_URL=https://prepport.duckdns.org` and deploy the frontend.

## Public How it Works page

Explain this sequence for one-time visitors:

1. Add foods and their tracker macros per 100 g.
2. Create a named Sunday prep session and record raw/cooked batch weights.
3. Build and save portions from those batches.
4. Copy raw-equivalent logging text into a nutrition tracker.

This is a concise product explanation, not a multi-step account onboarding system.

## Tracker boundary

Cronometer has no supported public individual-user write API, and MyFitnessPal’s
write API is private to approved partners. Keep copy-paste export in this slice.
Do not add OAuth, tracker credentials, reverse-engineered integrations, or CSV
export.

## Learning split

- **Session-name schema change and DTOs:** quick Spring/JPA intro.
- **Scoped batch CRUD:** reuse the ownership pattern already used for ingredients
  and sessions.
- **Portion log + derived availability:** new relational-data exercise; build and
  test it in small steps before the UI.
- **Reusable create/edit forms and collapsible detail:** React state/props practice.

## Not in scope

- README, screenshots, GitHub pin, and resume copy (**slice 8**)
- Meal/ingredient templates, USDA lookup, CSV export, direct tracker sync
- A standalone batch page, dashboards, dark mode, or heavy visual branding

## Local dev

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```
