# PrepPort — Project Plan

**Component-based meal prep companion for Cronometer users.**

PrepPort owns the Sunday batch workflow that nutrition trackers ignore: cook protein, carbs, and vegetables **separately**, record **raw-in → cooked-out yield**, assemble portions all week, and export **Cronometer-ready logging lines** (raw gram equivalents + macros). It does **not** replace Cronometer — there is no public API to push entries in.

---

## Problem (your workflow)

```
Sunday:  weigh RAW chicken (4.73 lb / 2146g) → cook → weigh COOKED (1600g)
         same for rice, broccoli — stored in separate containers
Week:    scoop cooked amounts → need macros
         Cronometer wants RAW weights for accuracy → manual math + Google Notes
```

PrepPort eliminates the Notes + mental math layer.

---

## Positioning

| Tool | Role |
|------|------|
| **Cronometer** | Daily diary, micronutrients, long-term tracking |
| **MacroPlan / meal planners** | AI recipes, grocery lists — different workflow |
| **PrepPort** | Sunday prep session, yield math, portion builder, export sheet |

**Resume line:** Built a Spring Boot app for component-based bulk meal prep with raw/cooked yield tracking and Cronometer export — filling the gap between a kitchen scale and nutrition trackers.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security (JWT) |
| Database | PostgreSQL (SQLite OK for local dev only) |
| Frontend | React 18 + TypeScript + Vite |
| Deploy | Docker Compose → Render / Railway / Fly.io |
| Tests | JUnit 5 for yield math; a few API integration tests |

**Planned repo layout (create when scaffolding):**

```
PrepPort/
├── PLAN.md                 ← this file
├── README.md
├── backend/                ← Spring Boot
├── frontend/               ← React
└── docker-compose.yml
```

---

## How we work (you build, I pair)

**You** are the main builder and architect — you type the code, make structure decisions, and own the repo.

**I** work alongside you:

- Explain a concept right before you need it (not weeks of upfront study)
- Scaffold boilerplate when friction is high (auth, Vite setup) — you read and adapt, not blind copy
- Unblock errors, review diffs, suggest next commit-sized step
- Do **not** silently build the whole app unless you ask

**Suggested rhythm per session:**

1. You say what slice you're on ("ingredient CRUD API")
2. I give a 5-minute concept brief + file list to create
3. You implement; paste errors or `@` files when stuck
4. End with one sentence: what you learned + next step

For each slice kickoff, include a short **learning split**: what gets a quick intro, what gets scaffolded with explanation, what you should type yourself, and what to debug together. Use outside tutorials only as targeted supplements, not prerequisites.

**Commit often** — one logical piece per commit (`feat: ingredient entity`, `feat: yield calculator tests`).

---

## Technical onboarding — what needs prep vs. jump in

Based on your background: strong **Java** (LeetCode, DS&A), strong **C/systems**, minimal **web frontend**, new to **Spring** and **Python-at-WINLAB** doesn't transfer to React.

Legend:

| Level | Meaning |
|-------|---------|
| **Ready** | Use now with almost no prep |
| **Quick intro** | 15–30 min explanation from me, then implement same session |
| **Short prep** | 1–3 hours solo (or one focused session with me) before productive work |
| **Defer** | Don't learn until that slice; I'll help when you get there |
| **Scaffold + study** | I generate boilerplate; you spend 1–2 hrs reading how it fits together |

### Stack map

| Technology | Your starting point | Prep level | When it appears | Notes |
|------------|---------------------|------------|-----------------|-------|
| **Java (core)** | Strong | **Ready** | Slice 0+ | Classes, interfaces, tests — your comfort zone |
| **JUnit 5** | Likely light | **Quick intro** | Slice 0 | `@Test`, `assertEquals` — same session as yield math |
| **Maven / Gradle** | New | **Quick intro** | Slice 1 | "pom.xml declares deps; `./mvnw spring-boot:run` runs app" — 10 min |
| **Git** | Used in coursework | **Ready** | Always | |
| **HTTP / REST** | Conceptual from CS | **Quick intro** | Slice 1 | GET/POST, JSON, status codes — 15 min before first controller |
| **Spring Boot** | New | **Short prep** OR **Scaffold + study** | Slice 1 | Know: `@RestController`, `@Service`, `@Autowired`, application.properties |
| **Spring Data JPA** | New | **Quick intro** per entity | Slice 1 | I explain when you add each entity; don't read all of JPA upfront |
| **PostgreSQL** | Likely light | **Quick intro** | Slice 1 | Install locally OR Docker; one `CREATE TABLE` not required — JPA handles it |
| **SQL / relations** | Coursework | **Quick intro** | Slice 1 | `user_id` foreign keys — explain when mapping `@ManyToOne` |
| **Spring Security + JWT** | New | **Scaffold + study** | Slice 1b (see below) | Highest boilerplate; don't DIY from scratch |
| **DTOs / validation** | New patterns | **Quick intro** | Slice 1–2 | Request/response objects separate from entities — when first API feels messy |
| **TypeScript** | New syntax | **Short prep** | Before Slice 4 | Skim types vs Java; optional 1-hr if React feels confusing |
| **React** | Minimal (BMI JS) | **Short prep** | Slice 4 | Components, `useState`, `useEffect`, `fetch` — 2–3 hrs before UI slice |
| **Vite** | New | **Scaffold + study** | Slice 4 | I scaffold; you learn `npm run dev` and folder layout |
| **CSS / layout** | Light | **Quick intro** | Slice 4 | Plain CSS or a minimal component library — don't learn Tailwind deeply unless you want to |
| **Docker Compose** | Tutorial exposure | **Defer** | Slice 8 | Copy-adapt compose file when deploying |
| **Deploy (Render etc.)** | New | **Defer** | Slice 8 | Step-by-step when backend + frontend run locally |

### Recommended order (adjusted for learning)

Don't try to learn Spring + Security + React + JPA in week one.

```
Slice 0   Java + JUnit only          ← zero Spring, pure domain math
Slice 1a  Spring Boot + JPA + REST   ← NO auth yet; hardcode userId=1 or single-user
Slice 1b  Add JWT auth               ← I scaffold; you study + wire to existing APIs
Slice 2   Portion API + export       ← mostly Java logic you already understand
Slice 3   Postman/curl comfort       ← optional buffer before React
Slice 4+  React UI                   ← after backend is trustworthy
```

**Why defer auth:** Spring Security is 30% of beginner frustration. Your APIs work the same with a temporary `X-User-Id: 1` header or no auth locally. Add real auth before deploy, not before you understand controllers and JPA.

### Per-slice: what I explain vs. what you build

| Slice | I typically provide | You build |
|-------|---------------------|-----------|
| 0 | Test cases for your chicken numbers | `YieldCalculator` class |
| 1a | `pom.xml` deps, project layout, first entity example | Ingredients + batches CRUD, repositories |
| 1b | Security config skeleton, JWT filter outline | Register/login endpoints, protect routes |
| 2 | Export string format spec | `PortionService`, controller, tests |
| 4 | Vite + React folder, `fetch` wrapper with auth header | Forms and pages one at a time |
| 7 | `docker-compose.yml` template | Env vars, deploy clicks |

### Optional prep (only if you want homework before week of Jun 29)

Not required — we can start cold on Slice 0 or 1a.

| Topic | Time | Resource style |
|-------|------|----------------|
| Spring Boot REST in 30 min | 30–60 min | Any "Spring Boot REST API tutorial" through first `@GetMapping` |
| JPA one-to-many mental model | 30 min | Skim how entity relationships map to tables |
| React hooks crash course | 2 hrs | Official React docs "Quick Start" + `useState` — **only before Slice 4** |

Skip full Spring Security tutorials until Slice 1b — they'll overwhelm before you have working endpoints.

### What you can start immediately (today)

| Action | Prep needed |
|--------|-------------|
| Slice 0: `YieldCalculator` + JUnit in plain Java | **None** — best if you want a win before tooling |
| Slice 1a: Spring Initializr project + one `GET /health` | **10 min** on what Spring Boot is |
| Installing PostgreSQL or Docker for Postgres | **30 min** setup; I can walk through |
| React / TypeScript | **Wait** until backend APIs work in Postman |

**Recommendation for you:** **Slice 0 this week** (1–2 hours, pure Java) → **Slice 1a next session** with me scaffolding Spring and explaining each file as you add Ingredient.

---

## Domain model

```
User
 └── Ingredient          (reusable food definition — your "chicken breast raw")
 └── PrepSession         (one Sunday — e.g. "2026-06-15")
      └── Batch          (one cooked component in that session)
 └── MealTemplate        (saved portion combo — e.g. "standard lunch")
 └── PortionLog          (optional — what you ate on a given day)
```

### Ingredient

A **stable food definition** you reuse every week. Macros are stored **per 100g** on a declared basis (raw or cooked).

| Field | Example |
|-------|---------|
| name | Chicken breast, boneless skinless |
| macro_basis | `RAW` or `COOKED` |
| protein_per_100g | 31.0 |
| carbs_per_100g | 0.0 |
| fat_per_100g | 3.6 |
| kcal_per_100g | 165 |
| notes | "Copied from Cronometer 2026-06-10" |

### Batch (per prep session)

One component cooked on Sunday.

| Field | Example |
|-------|---------|
| ingredient_id | → Chicken breast |
| raw_weight_g | 2146 |
| cooked_weight_g | 1600 |
| yield_ratio | 0.746 (computed) |
| notes | "Baked on sheet pan" |

**Derived:** macros per 100g **cooked** = scale from raw basis using yield ratio.

### Portion line (builder)

One row in a meal: amount taken from a **specific batch**.

| Field | Example |
|-------|---------|
| batch_id | Sunday chicken batch |
| cooked_amount_g | 200 |
| → raw_equivalent_g | 268 (for Cronometer) |
| → macros | computed |

---

## Component onboarding — three tiers

You were unsure how users add foods. Use **tiered onboarding** — ship Tier 1 in MVP, add Tier 2 when MVP works, Tier 3 if time allows.

### Tier 1 — Manual ingredient (START HERE)

**Best for:** MVP, your own use, zero external APIs.

**Flow:**
1. User clicks **Add ingredient**
2. Enters name, macro basis (`RAW` recommended for chicken), P/C/F/kcal per 100g
3. Values copied once from Cronometer's food entry screen (or USDA label)
4. Ingredient saved to personal library — **never re-enter unless the food changes**

**Why start here:** Your real pain is yield + portion math, not food database search. Manual entry is 5 minutes once per staple (chicken, rice, broccoli).

**Starter set for yourself (seed after auth works):**

| Ingredient | Basis | Notes |
|------------|-------|-------|
| Chicken breast, raw | RAW | Dry/raw weigh → cook → cooked yield (yield &lt; 1) |
| White rice, dry | RAW | Dry weigh → cook → cooked yield (yield &gt; 1) |
| Broccoli, raw | RAW | Raw florets → cook → cooked yield |

**MVP batch rule:** Every batch records **both** `raw_weight_g` and `cooked_weight_g`. Dry/raw weight drives batch macros; cooked weight drives portions and yield ratio (works for chicken shrinkage and rice absorption alike).

**Defer post-MVP:** Post-cook add-ins (butter/oil stirred into a finished pan) — model as separate ingredients or composite batches later.

### Tier 2 — Quick-add templates (Phase 2)

**Best for:** Faster onboarding without building a full food DB.

Pre-built **templates** user can clone into their library:

- Chicken breast (raw)
- Ground turkey (raw)
- Jasmine rice (dry/raw)
- Broccoli (raw)
- Sweet potato (raw)

Templates ship as JSON in the backend (`/api/ingredient-templates`). User picks one → edits if needed → saves as their ingredient.

**No API key. No scraping Cronometer.**

### Tier 3 — USDA FoodData Central search (Phase 3)

**Best for:** Polish, fewer manual macro lookups.

USDA FDC API is free: https://fdc.nal.usda.gov/api-guide.html

- User searches "chicken breast raw"
- App shows top hits with macros per 100g
- User confirms → creates Ingredient with `usda_fdc_id` for reference

**Do not build until Tier 1 + batch flow + export work end-to-end.**

---

## Build slices (mapped to calendar)

Build in **vertical slices**, not horizontal layers. Dates revised **Jul 2026** after slice 1b.

### MVP tiers (what “done” means)

| Tier | Slices | You have… |
|------|--------|-----------|
| **Product MVP** (local) | 0, 1a, 1b ✓ + **2** + **4** + **5** | Full Sunday flow in the browser: prep → portion → Cronometer export |
| **Resume MVP** (deployed) | Product MVP + **8** + **9** | Live demo URL, README, GitHub pin for applications |

Slices **3**, **6**, **7** optional — polish while applying, not blockers.

**Deadlines (revised):**

| Target | Slice(s) |
|--------|----------|
| **Jul 24** | 2 — portion calculate + export API |
| **Jul 28–29** | 4 + 5 — React UI (ingredients, prep, portion builder, export) |
| **Jul 31** (worst case) | 8 + 9 — deploy + README/resume link |

Then iterate (templates, tests, add-ins) **while applications go out** (fall intern recruiting peak Sept–Nov 2026).

### Slice 0 — Yield math · **by Jun 29**

Pure Java: given raw g, cooked g, macros per 100g raw → macros per 100g cooked + raw equivalent for any cooked portion.

```
raw=2146g, cooked=1600g, protein=31g/100g raw
→ 200g cooked chicken ≡ 268g raw → 83g protein
```

**Start here if:** you want confidence before Spring setup.

### Slice 1a — Backend CRUD (no auth) · **by Jul 6** ✓ Complete

- Spring Boot + PostgreSQL
- CRUD: ingredients, prep-sessions, batches
- Test with curl or Postman
- **Dogfood:** log your last Sunday chicken batch via API
- See [docs/slices/slice-1a.md](./docs/slices/slice-1a.md)

### Slice 1b — JWT auth · **by Jul 6–10** ✓ Complete

- See [docs/slices/slice-1b.md](./docs/slices/slice-1b.md)
- Register/login, JWT, `user_id` scoping, `requests.http` auth flow
- **Also shipped:** `CreateBatchRequest` DTO; ingredient ownership on batch create

### Slice 2 — Portion calculate + Cronometer export · **by Jul 24** ← current

- See [docs/slices/slice-2.md](./docs/slices/slice-2.md)

- `POST /api/portion/calculate` — `{ batchId, cookedGrams }` → raw equivalent + macros + totals
- `GET /api/portion/export` — copy-paste block (core product value + export in one slice)

Example export:

```
--- PrepPort → Cronometer ---
Lunch (2026-06-16)

Chicken breast, raw .............. 268 g
Rice, white, cooked .............. 180 g
Broccoli, cooked ................. 85 g

Totals: 52 P / 48 C / 8 F / 480 kcal
```

### Slice 3 — Postman / API comfort · **optional** (buffer before React)

- Document all endpoints; save collection
- Skip if confident

### Slice 4 — React: ingredients + prep session · **by Jul 28–29**

1. Ingredients list + add form
2. New prep session + batches

### Slice 5 — React: portion builder + export UI · **by Jul 28–29** (ship with slice 4)

3. Portion builder with live macros
4. Export panel with copy button

Mobile-friendly (Sunday at the scale).

### Slice 6 — Meal templates · **optional (cut if behind)**

- Save "Standard lunch"; reload against current week's batches

### Slice 7 — Ingredient templates · **optional (cut if behind)**

- Clone starter foods from JSON templates

### Slice 8 — Deploy · **by Jul 31** (worst case; aim earlier after 4+5)

- Docker Compose, Render/Railway, env vars, auth hardened for production

### Slice 9 — README + resume · **by Jul 31** (ship with slice 8)

- Screenshots, setup instructions, live demo link, GitHub pin

---

## Raw vs cooked basis — decision guide

**`macro_basis` on Ingredient** = where per-100g macros came from in Cronometer (RAW dry entry vs COOKED entry). **`raw_weight_g` / `cooked_weight_g` on Batch** = what you weighed Sunday (always both in MVP).

| Food | Recommended `macro_basis` | Batch fields (MVP) |
|------|-------------------------|-------------------|
| Chicken, beef, fish | **RAW** | `raw_weight_g` + `cooked_weight_g` |
| Rice, pasta (dry) | **RAW** | `raw_weight_g` + `cooked_weight_g` (yield often &gt; 1) |
| Vegetables | **RAW** (or COOKED if macros are per cooked 100g) | `raw_weight_g` + `cooked_weight_g` |
| Pre-made sauce | COOKED or per-label serving | `raw_weight_g` + `cooked_weight_g` (same shape; raw may equal cooked if no yield step) |

**MVP rule:** All batches require **both** weights. Yield math applies uniformly (`cooked / raw`); chicken shrinks, rice expands — same workflow.

**Post-MVP:** Optional COOKED-only shortcut ingredients, post-cook add-ins in one pan, and composite batches.

---

## Cronometer integration (export only)

Cronometer has **no public write API**. PrepPort integrates via:

1. **Copy-paste export** (MVP) — formatted text with raw grams
2. **CSV export** (Phase 2) — columns: food_name, grams, basis, meal_slot
3. **Recipe card** (Phase 2) — instructions to create a Custom Recipe in Cronometer with exact weights

Do **not** plan OAuth, credential storage, or reverse-engineered API calls.

---

## API sketch (MVP)

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/ingredients
POST   /api/ingredients
PUT    /api/ingredients/{id}
DELETE /api/ingredients/{id}

GET    /api/prep-sessions
POST   /api/prep-sessions
GET    /api/prep-sessions/{id}
POST   /api/prep-sessions/{id}/batches

POST   /api/portion/calculate
GET    /api/portion/export

GET    /api/meal-templates          (Phase 2)
POST   /api/meal-templates
```

---

## Database tables (MVP)

```sql
users (id, email, password_hash, created_at)

ingredients (
  id, user_id, name,
  macro_basis,          -- RAW | COOKED
  protein_per_100g, carbs_per_100g, fat_per_100g, kcal_per_100g,
  notes, created_at
)

prep_sessions (
  id, user_id, session_date, notes, created_at
)

batches (
  id, prep_session_id, ingredient_id,
  raw_weight_g,          -- required (dry/raw weigh-in)
  cooked_weight_g,       -- required (post-cook yield for portions)
  created_at
)

meal_templates (        -- Phase 2
  id, user_id, name, created_at
)

meal_template_lines (
  id, meal_template_id, ingredient_id,
  cooked_amount_g        -- applied to matching batch in active session
)
```

---

## Internship plan alignment (lines 198–211)

PrepPort satisfies the full-stack requirements from the [internship prep plan](c:\Users\Danny Heller\OneDrive\Desktop\Code\.cursor\plans\internship_season_prep_f83ea34e.plan.md):

| Requirement | PrepPort |
|-------------|----------|
| Java + Spring Boot | Backend |
| React + TypeScript | Frontend |
| PostgreSQL | Production DB |
| Docker Compose + cloud deploy | Slice 8 |
| README + 2–3 API tests | Slice 0 + 8–9 |
| Auth | JWT (Slice 1b) |
| 2–3 CRUD entities | Ingredients, prep sessions, batches |
| Non-trivial feature | Yield math + Cronometer export |

**Cut if behind:** Slices 6–7 (templates). **Never cut:** portion calculate, export, deploy, README.

---

## Calendar (revised Jul 2026)

**Product MVP local:** slices 2 + 4 + 5 by **Jul 29**. **Resume MVP deployed:** slices 8 + 9 by **Jul 31** (worst case).

| Target date | Focus | Exit criteria |
|-------------|-------|---------------|
| **Jun 29** | Slice 0 or 1a | Math tests OR first API *(done)* |
| **Jul 6–22** | 1a + 1b | JWT auth; scoped CRUD *(done)* |
| **Jul 24** | Slice 2 | 268g raw for 200g cooked; export API works |
| **Jul 28–29** | Slices 4 + 5 | Full Sunday flow in browser |
| **Jul 31** | Slices 8 + 9 | **Live demo URL + README on resume** |
| **Aug onward** | Apply + polish | 6, 7, tests, post-MVP features while applications open |

Weekday evenings (~2–3 hrs): finish current slice if the week was short — don't skip ahead of product MVP (2 → 4 → 5) before deploy.

---

## Slice checklist (by target date)

| Target date | Slice | Done when |
|-------------|-------|-----------|
| **Jun 29** | 0 or 1a | Chicken math tests OR first API works *(done)* |
| **Jul 6–22** | 1a + 1b | Login protects routes; user-scoped CRUD *(done)* |
| **Jul 24** | 2 (+ 3 optional) | 268g raw for 200g cooked; export text works |
| **Jul 28–29** | 4 + 5 | **Product MVP:** full local UI flow |
| **Jul 31** | 8 + 9 | **Resume MVP:** live URL + README |
| *while applying* | 6 + 7 | Meal + ingredient templates |

---

## What NOT to build in v1

- Full nutrition diary (Cronometer's job)
- Barcode scanner
- AI meal plans (MacroPlan's job)
- Cronometer login / sync
- Mobile native app
- Grocery lists (Phase 3+)
- Post-cook add-ins modeled inside a single batch (butter stirred into rice pan) — defer until after MVP

---

## Success criteria (deploy before applications)

- [ ] Used PrepPort for at least 1 real Sunday prep (2 ideal) — after slices 4 + 5
- [ ] Chicken raw→cooked→portion→export without Google Notes — **product MVP** (2 + 4 + 5)
- [ ] **Deployed + README + live demo by Jul 31, 2026** (worst case) — **resume MVP** (8 + 9)
- [ ] GitHub pinned; 2–3 JUnit API tests in repo

---

## Next action

**Slice 2 — Portion calculate + Cronometer export.**

- Slice doc: [docs/slices/slice-2.md](./docs/slices/slice-2.md)
- Wire [YieldCalculator](./backend/src/main/java/com/prepport/yield/YieldCalculator.java) into protected APIs; exit criterion: 200 g cooked chicken → ≈268 g raw + export text block.
- Auth and user scoping from 1b carry forward — new portion routes are already behind `anyRequest().authenticated()`.
