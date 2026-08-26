# Agent handoff — Slice 6 (AWS deploy — Lightsail)

**Status:** In progress — **Lightsail chosen**, credits checked. Read this **and** [slice-6.md](./slice-6.md) before changing anything. Plan: [PLAN.md](../../PLAN.md).

---

## Opener (human can paste)

> PrepPort **slice 6 — AWS deploy**. Read `docs/slices/slice-6.md` and this handoff. Product MVP is local-complete (slices 2 + 4 + 5). Deploying on **Lightsail** (one box, Docker Compose). I'm new to AWS — explain console steps; I type commands. Pairing: I implement; you review and unblock. Do not start slice 7 UI or slice 8 README except tiny deploy-required edits. Shell: `rtk` prefix. Do not commit unless I ask. Do not put secrets in git.

---

## What the next agent must know

**Product:** Cronometer *companion* (not a diary). Sunday batches: raw + cooked weights → portion builder → copy-paste export with **raw gram equivalents**. No Cronometer API.

**Stack:** Java 17, Spring Boot 3.5.3, JPA, PostgreSQL, JWT (`jjwt` 0.12.6), React 18 + TypeScript + Vite.

**Pairing / scope:** Rising junior; minimal diffs; one slice. Never cut export or deploy. Slice 7 = router/UX, slice 8 = GitHub+README, slice 9 = later polish.

**AWS decision (locked):**

| Choice | Detail |
|--------|--------|
| **Service** | **Amazon Lightsail** — one Linux instance, Docker Compose (Postgres + API), Nginx for static frontend + reverse proxy |
| **Not using** | Elastic Beanstalk, RDS, ECS/EKS (deferred) |
| **Instance** | 1 GB RAM plan (~$5–10/mo); static IP attached |
| **Credits** | ~**$120** remaining (signup $100 + Budgets tutorial $20), Lightsail eligible, expires May 2027; $0 used so far |
| **User AWS experience** | Account exists; **not familiar** with console, SSH, or server ops — walk clicks step-by-step |

**Target architecture:**

```
https://<public-host>/          → Nginx → frontend/dist
https://<public-host>/api/*     → Nginx → Spring :8080
https://<public-host>/health    → Nginx → Spring :8080
Postgres                        → Docker on same host, not exposed publicly
```

---

## Repo state (do not assume Dockerized app)

| Piece | Reality |
|-------|---------|
| `docker-compose.yml` | **Postgres 16 only** — local dev, not the Spring app |
| Dockerfile | **None yet** — needed in Phase 2 |
| `application-prod.properties` | **None yet** — needed in Phase 1 |
| `GET /health` | Public, returns `OK` — `HealthController` |
| Auth | `POST /api/auth/register`, `/api/auth/login` → `{ token }`; `SecurityConfig` JWT filter |
| CORS | **Hardcoded** `http://localhost:5173` in `SecurityConfig` |
| JPA | **`ddl-auto=create-drop`** in `application.properties` — **unsafe for prod** |
| JWT | `JWT_SECRET` env with a **dev default** in properties — override on server only |
| Frontend API | `import.meta.env.VITE_API_URL` — **no `/api` suffix**; baked in at **build** time |
| Tests | `YieldCalculatorTest`, `PortionServiceTest` (chicken ≈268 g raw for 200 g cooked from 2146/1600) |

Smoke file: [requests.http](../../requests.http).

---

## Phased work (current progress)

| Phase | What | Status |
|-------|------|--------|
| **0** | Billing / credits / pick Lightsail | ✓ Credits checked; Lightsail chosen |
| **1** | `application-prod.properties`, CORS from env | Not started |
| **2** | `backend/Dockerfile`, `docker-compose.prod.yml` | Not started |
| **3** | Create Lightsail instance, static IP, firewall, SSH | Not started |
| **4** | Install Docker on server, deploy API + Postgres | Not started |
| **5** | Build frontend, Nginx, HTTPS | Not started |
| **6** | Persistence proof + Sunday smoke + demo URL | Not started |

Full step list: [slice-6.md](./slice-6.md#work-order-follow-in-order).

---

## Must-do prod changes (this slice)

1. Stop using `create-drop` when `prod` (use `update` or equivalent).
2. Datasource from env (Compose Postgres hostname `postgres`, not localhost-only in prod).
3. CORS includes the live frontend origin.
4. Strong `JWT_SECRET` only via server `.env` — never commit it.
5. Frontend production build with `VITE_API_URL` pointing at the public API.
6. Persist a user + ingredient across an API restart (proves DB is real).

---

## Agent behavior for AWS-new user

- Explain **what each console screen does** before the human clicks (Lightsail instance, static IP, firewall, SSH key).
- Give **copy-paste SSH commands** with placeholders (`<static-ip>`, path to `.pem`).
- Never put secrets in git or in committed files; use server-side `.env` and gitignored local `.env`.
- Scaffold repo files only when asked; human creates AWS resources.
- On errors: ask for exact console message or `docker compose logs` output.

## Conventions

- API base: `VITE_API_URL` · Bearer on protected routes
- Human builds and clicks; agent explains/reviews
- Shell: `rtk` on each command
- Do not expand into React Router, templates, USDA, or a full README rewrite

## Deferred (not slice 6)

- No React Router — pages stacked in `App.tsx` (slice 7)
- Meal templates / CSV (slice 9)
- README screenshots + GitHub pin (slice 8) — after UI so docs match the demo
- Beanstalk + RDS unless Lightsail is outgrown

---

## Exit for this conversation

Live HTTPS URL; `GET /health` OK; register/login/portion/export from the public site; chicken check ≈268 g `cronometerG`; data survives API restart. Hand off to slice 7 with the demo URL written down (README comes in slice 8).
