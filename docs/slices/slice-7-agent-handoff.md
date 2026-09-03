# Agent handoff — Slice 7 (recruiter-ready UI/UX)

**Status:** In progress. Read [slice-7.md](./slice-7.md) and [PLAN.md](../../PLAN.md)
before changing code.

## Opener

> PrepPort Slice 7 is in progress. Read `docs/slices/slice-7.md` and this handoff.
> We build together in the listed mini-sections, not as a one-shot refactor. Begin
> with the current mini-section only, explain the concepts briefly, then let me
> implement and review it. Shell commands use `rtk`. Do not commit unless I ask.

## Product and live context

- PrepPort is a meal-prep companion: ingredients → named prep session → batches →
  saved portions → copy logging text for a nutrition tracker.
- Live demo: **https://prepport.duckdns.org**.
- Stack: React 18 + TypeScript + Vite; Spring Boot + JPA + PostgreSQL; frontend
  served by Nginx on Lightsail.
- Slice 6 deployment is complete. Slice 8 README/screenshots begin only after
  Slice 7 is complete and deployed.

## Existing work

- Router, protected routes, app/auth layouts, login/register pages, and page
  descriptions are already committed.
- Ingredient and prep-session backend `PUT`/`DELETE` APIs already exist but are
  not wired into the frontend.
- Batches currently have create only; batch update/delete APIs must be added.
- Portion calculate/export is currently stateless. Saved portion logs and derived
  availability do not exist yet.

## Build contract

### Hierarchy

```text
Prep session (required name + date)
  └── Batch (raw/cooked weights)
       └── Saved portion history
```

Keep batches inside their prep session. Use collapsible history/details to prevent
crowding. Do not create a top-level batches page unless later dogfooding proves it
necessary.

### Portion accounting

Save a named/date-stamped portion log with one or more batch lines. Available
cooked grams are derived server-side:

```text
batch cooked grams − sum(saved portion-log-line cooked grams)
```

Do **not** store a mutable remaining-grams column. Validate availability on
create/update and make edit/delete restore availability naturally.

### Tracker boundary

Keep copy-paste export and use tracker-neutral UI language. Cronometer does not
offer a supported public individual-user write API, and MyFitnessPal write access
is partner-only. Do not add OAuth, third-party credentials, reverse-engineered
tracker APIs, or CSV export in this slice.

## Mini-section order

1. **7.1 Foundation** — number-input fix, navigation freshness, `/how-it-works`.
2. **7.2 Ingredients** — list/details/add/edit/delete using existing APIs.
3. **7.3 Prep sessions** — required name; list-first session CRUD and clear detail.
4. **7.4 Batches** — scoped update/delete API plus vertical add/edit UI.
5. **7.5 Saved portions** — portion-log entities/API, availability validation,
   nested batch history.
6. **7.6 Builder** — labels, availability, name/date, save, neutral export copy.
7. **7.7 Finish** — responsive polish, tests, live deployment and smoke test.

For each mini-section: agree on the smallest design, implement one vertical path,
run relevant tests/build, inspect the result, then move on.

## Deploy reminder

```bash
cd frontend
VITE_API_URL=https://prepport.duckdns.org npm run build
scp -i ~/.ssh/lightsail-us-east-1.pem -r dist ubuntu@3.225.15.117:~/prepport-dist-new
```

On the server, copy the contents into `/var/www/prepport/` and set ownership to
`www-data`. Use a fresh remote staging directory every deploy.

## Deferred

- README/GitHub pin/resume copy (Slice 8)
- Ingredient/meal templates, USDA lookup, CSV, direct tracker sync
- Dashboard, standalone inventory/batches page, dark mode, full brand system
