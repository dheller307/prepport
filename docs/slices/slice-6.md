# Slice 6 — AWS deploy (Lightsail)

**Status:** Complete · **Next:** [slice 7](./slice-7.md) (UI / React Router) · see [PLAN.md](../../PLAN.md)

**Target:** Aug 2026 · Live demo URL for the **product MVP** (slices 2 + 4 + 5). UI polish is slice 7; README/GitHub pin is slice 8.

Agent handoff: [slice-6-agent-handoff.md](./slice-6-agent-handoff.md)

## Done when

- [x] Backend reachable on HTTPS; `GET /health` returns `OK` without auth
- [x] PostgreSQL persists data (register → login → ingredient still there after restart)
- [x] Frontend static build talks to the deployed API via `VITE_API_URL`
- [x] CORS allows the **deployed frontend origin** (not only `http://localhost:5173`)
- [x] `JWT_SECRET` is a strong secret from env — **not** the `application.properties` default, **not** in git
- [x] Hibernate is **not** `create-drop` in production (that wipes the DB on every restart)
- [ ] Full Sunday smoke on the live URL: register → ingredient → prep session → batch → portion calculate → export copy (chicken ≈268 g) — confirm in Phase 6 if not already done

## Context (read first)

- Product MVP is **local-complete**. Do not rebuild APIs or the React pages in this slice except what deploy requires (env, CORS, prod JPA, Docker).
- User has an **AWS account** with **~$120 credits** (Lightsail eligible, expires May 2027). **New to AWS** — agent walks console clicks; human owns the account and types commands.
- **Deploy shape (locked):** one **Amazon Lightsail** Linux instance (~$5–10/mo after credits; use **1 GB RAM**, not 512 MB). Docker Compose on the box: **Postgres + Spring API**. Static frontend on the same box (Nginx) or S3 later — start with Nginx on the box for simplicity.
- Pairing: human implements; agent explains, reviews, unblocks. Scaffold Docker/compose/prod properties when asked.
- Shell: prefix commands with `rtk`. Do not commit unless asked. Do not push secrets.

Local stack today:

```
PrepPort/
├── backend/                 Spring Boot 3.5.3, Java 17, JAR via mvnw
├── frontend/                Vite + React 18 + TS
├── docker-compose.yml       Postgres 16 only (local dev)
└── requests.http            API smoke (auth + CRUD + portion)
```

## Chosen architecture

```
Browser  →  https://<lightsail-ip-or-domain>/
              ├── Nginx serves frontend/dist (static React)
              └── Nginx proxies /api/* and /health → Spring Boot :8080
                    └── Postgres (Docker, same host, not public)
```

**Why Lightsail (not Beanstalk + RDS):** predictable low cost, credits apply, one box mirrors local Compose, fewer AWS services to learn for a first deploy. Beanstalk + RDS deferred unless you outgrow this box.

**AWS concepts (30-second primer):**

| Term | What it means for PrepPort |
|------|----------------------------|
| **Lightsail instance** | A small Linux server in AWS's cloud — like a rented computer that stays on 24/7 |
| **Static IP** | A fixed public address so the URL does not change when you reboot |
| **SSH key** | Password-less login from your laptop to the server (`.pem` file — **not** in git) |
| **Firewall (ports)** | Lightsail only opens ports you allow (80/443 for web, 22 for SSH) |
| **Docker Compose** | One file that starts Postgres + API containers together on the server |
| **Credits** | AWS applies your $120 balance to eligible bills before charging your card |

## Blockers in current code (must fix for prod)

| Issue | Where | Risk |
|-------|--------|------|
| `spring.jpa.hibernate.ddl-auto=create-drop` | `backend/src/main/resources/application.properties` | **Wipes schema + data on every backend restart** |
| CORS hardcoded to Vite | `SecurityConfig.corsConfigurationSource()` → `http://localhost:5173` | Browser calls from the live origin will fail |
| Weak JWT default | `prepport.jwt.secret=${JWT_SECRET:dev-secret-…}` | Fine for local; **must** set `JWT_SECRET` on the server (≥32 chars) |
| Datasource is localhost only | `jdbc:postgresql://localhost:5432/prepport` | Prod needs env override (`SPRING_DATASOURCE_*`) pointing at the Compose Postgres service name |
| No Dockerfile | repo | Need `backend/Dockerfile` + prod `docker-compose` for the Lightsail box |
| `VITE_API_URL` | frontend `.env` (gitignored) | Vite **bakes this in at `npm run build`** — must be the public API URL |

Public routes already: `/health`, `/api/auth/**`. Everything else needs `Authorization: Bearer`.

## Work order (follow in order)

### Phase 0 — Billing sanity ✓

- [x] Log into AWS → Billing → Credits: **$120** remaining, Lightsail listed as eligible
- [ ] Confirm **Free plan vs Paid plan** (Billing → Account). Paid = card can be charged after credits; set a **Budget alert** (you already earned a $20 credit for this)
- [ ] Optional: finish remaining **Explore AWS** tutorials (EC2, RDS, Lambda, Bedrock) for up to **$80** more credits — delete tutorial resources after each

### Phase 1 — Repo: production Spring config (local, no AWS yet)

Goal: app runs locally with `SPRING_PROFILES_ACTIVE=prod` and env vars, without wiping data.

1. Add `application-prod.properties`: `ddl-auto=update` (or `validate` after first boot), datasource from env, no dev JWT default in prod profile.
2. Wire CORS from env (e.g. `PREPPORT_CORS_ORIGINS`) — include `http://localhost:5173` **and** placeholder for live origin.
3. Verify locally: Postgres up via `docker compose`, export env vars, run backend with `prod` profile, register + create ingredient, restart backend — data still there.

**Agent may scaffold** these files when you ask. **You** run and confirm.

### Phase 2 — Repo: Docker for deploy

Goal: one command on the server starts Postgres + API.

1. `backend/Dockerfile` — multi-stage or simple: build JAR with Maven, run on Java 17.
2. `docker-compose.prod.yml` (or extend compose) — services: `postgres` + `api`; env from a **server-side** `.env` file (gitignored).
3. Smoke on your machine: `docker compose -f docker-compose.prod.yml up`, hit `http://localhost:8080/health`.

### Phase 3 — Lightsail: create the server (console)

Goal: a reachable Linux box with a stable address. **You click; agent explains each screen.**

1. **Lightsail** → Create instance → **Linux/Unix** → **OS Only** → **Ubuntu 22.04** (or Amazon Linux 2).
2. Plan: **$5 or $10/mo** instance — pick **1 GB RAM** minimum for the JVM.
3. Name it e.g. `prepport-prod`.
4. **Create static IP** → attach to this instance (so reboots do not change the URL).
5. **Networking / Firewall:** open **HTTP (80)**, **HTTPS (443)**, **SSH (22)**. Do **not** open Postgres (5432) to the internet.
6. **Account** → **SSH keys** → download the default key (`.pem`) — store outside the repo.
7. SSH test from your laptop: `ssh -i path/to/key.pem ubuntu@<static-ip>` (username may be `ubuntu` or `ec2-user` depending on OS).

### Phase 4 — Server: install runtime + deploy API

Goal: Postgres + Spring running in Docker on the box.

1. On the instance (via SSH): install **Docker** and **Docker Compose** (agent provides exact commands).
2. Copy deploy artifacts to the server (`git clone`, `scp`, or build image locally and push — start with `git clone` + build on server).
3. On the server, create `.env` with production secrets (never commit):

   ```
   JWT_SECRET=<≥32 random chars>
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/prepport
   SPRING_DATASOURCE_USERNAME=prepport
   SPRING_DATASOURCE_PASSWORD=<strong password>
   POSTGRES_PASSWORD=<same or separate>
   PREPPORT_CORS_ORIGINS=https://<your-public-host>,http://localhost:5173
   ```

4. `docker compose -f docker-compose.prod.yml up -d`
5. Confirm from your laptop: `curl http://<static-ip>:8080/health` → `OK` (or via Nginx once Phase 5 is done).

### Phase 5 — Frontend build + Nginx + HTTPS

Goal: browser loads React and talks to the API on the same host.

1. On your laptop: `VITE_API_URL=https://<public-host> npm run build` in `frontend/` (no `/api` suffix).
2. Copy `frontend/dist` to the server (e.g. `/var/www/prepport`).
3. Install **Nginx** on the instance:
   - Serve `dist` at `/`
   - Proxy `/api` and `/health` to `http://localhost:8080`
4. **HTTPS:** Lightsail **Load balancer + certificate** (simplest on Lightsail) **or** **Certbot** on the instance for a free Let's Encrypt cert if you have a domain. IP-only demos can start on HTTP for a private smoke, but **done when** requires HTTPS for the resume link.
5. Update `PREPPORT_CORS_ORIGINS` with the real `https://` origin; restart API container.
6. Browser: register → login from the live URL.

### Phase 6 — Prove persistence + Sunday smoke

1. Register, add an ingredient, restart the API container (`docker compose restart api`) — ingredient still there.
2. Full flow: prep session → batch → portion calculate → export copy.
3. Chicken check: 2146 raw / 1600 cooked, 200 g cooked portion → `cronometerG` ≈ **268**.
4. Write down the **live demo URL** for slice 7/8 (README comes in slice 8).

## Learning split

| Topic | Level | Notes |
|-------|--------|--------|
| Spring profiles + env vars | Quick intro | `SPRING_PROFILES_ACTIVE=prod`; never commit prod secrets |
| Why not `create-drop` | Quick intro | Dev convenience vs production persistence |
| CORS origins | Quick intro | Browser origin ≠ API origin; OPTIONS preflight |
| JWT secret in prod | Ready | Same `JwtService`; only the value changes |
| Vite env at **build** time | Quick intro | Changing `VITE_API_URL` requires a rebuild |
| Docker Compose (prod) | Scaffold + study | Postgres + api on one host; env file on server only |
| Lightsail console | Walkthrough | Static IP, firewall, SSH — agent explains; you click |
| Nginx reverse proxy | Quick intro | One public port; static files + API behind it |
| SSH + server basics | New | Connect, run commands, read logs (`docker compose logs`) |

**Agent may scaffold:** `application-prod.properties`, Dockerfile, `docker-compose.prod.yml`, CORS env wiring, Nginx config sketch — **you** create the Lightsail instance, SSH in, and paste errors.

## Env sketch (server-side `.env` — not in git)

```
JWT_SECRET=                  # ≥32 random chars
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/prepport
SPRING_DATASOURCE_USERNAME=prepport
SPRING_DATASOURCE_PASSWORD=
POSTGRES_PASSWORD=           # match compose Postgres service
PREPPORT_CORS_ORIGINS=       # https://<public-host>,http://localhost:5173

# Frontend build (on your laptop, not on server)
VITE_API_URL=https://<public-host>   # no /api suffix
```

## Not in scope

- React Router, nav, visual redesign (slice 7)
- README rewrite, GitHub pin, resume bullets (slice 8)
- Meal/ingredient templates, USDA (slice 9)
- Cronometer OAuth / write API
- Elastic Beanstalk, RDS, ECS/EKS (deferred unless you outgrow Lightsail)

## Local reminder (unchanged)

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```
