# PrepPort

Component-based meal prep companion for Cronometer users. Cook protein, carbs, and vegetables separately; track raw→cooked yield; export Cronometer-ready portions.

**Status:** Slice 1a complete — backend CRUD (ingredients, prep sessions, batches). Working on slice 1b (JWT auth).

Cursor: open this folder as workspace; rules live in `.cursor/rules/`.

## Quick links

- [Full project plan](./PLAN.md)
- [Slice 0 — yield math](./docs/slices/slice-0.md) ✓
- [Slice 1a — backend CRUD](./docs/slices/slice-1a.md) ✓
- [Slice 1b — JWT auth](./docs/slices/slice-1b.md) ← current
- Stack: Java 17 · Spring Boot · PostgreSQL · React · TypeScript

## Local dev

```bash
docker compose up -d
cd backend
./mvnw spring-boot:run   # Windows: mvnw.cmd
```

API smoke tests: [requests.http](./requests.http)
