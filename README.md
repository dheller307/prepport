# PrepPort

Component-based meal prep companion for Cronometer users. Cook protein, carbs, and vegetables separately; track raw→cooked yield; export Cronometer-ready portions.

**Status:** Product MVP local + **AWS live** (slice 6). **Current:** [PLAN.md](./PLAN.md) slice **7** (UI) → 8 (GitHub + README).

Cursor: open this folder as workspace; rules live in `.cursor/rules/`.

## Quick links

- [Full project plan](./PLAN.md)
- [Slice 0 — yield math](./docs/slices/slice-0.md) ✓
- [Slice 1a — backend CRUD](./docs/slices/slice-1a.md) ✓
- [Slice 1b — JWT auth](./docs/slices/slice-1b.md) ✓
- [Slice 2 — portion + export](./docs/slices/slice-2.md) ✓
- [Slice 4 — React ingredients + prep](./docs/slices/slice-4.md) ✓
- [Slice 5 — portion builder + export UI](./docs/slices/slice-5.md) ✓
- [Slice 6 — AWS deploy](./docs/slices/slice-6.md) ✓
- [Slice 7 — UI / UX](./docs/slices/slice-7.md) ← current
- [Slice 7 agent handoff](./docs/slices/slice-7-agent-handoff.md)
- Live demo: **https://prepport.duckdns.org**
- Stack: Java 17 · Spring Boot · PostgreSQL · React · TypeScript

## Local dev

```bash
docker compose up -d
cd backend
./mvnw spring-boot:run   # Windows: mvnw.cmd
```

API smoke tests: [requests.http](./requests.http)
