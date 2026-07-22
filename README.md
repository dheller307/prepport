# PrepPort

Component-based meal prep companion for Cronometer users. Cook protein, carbs, and vegetables separately; track raw→cooked yield; export Cronometer-ready portions.

**Status:** Slice 1b complete — JWT auth, user-scoped CRUD. **Current:** [Slice 2](./docs/slices/slice-2.md) (by Jul 24) → 4+5 (Jul 28–29) → deploy 8+9 (Jul 31 worst case).

Cursor: open this folder as workspace; rules live in `.cursor/rules/`.

## Quick links

- [Full project plan](./PLAN.md)
- [Slice 0 — yield math](./docs/slices/slice-0.md) ✓
- [Slice 1a — backend CRUD](./docs/slices/slice-1a.md) ✓
- [Slice 1b — JWT auth](./docs/slices/slice-1b.md) ✓
- [Slice 2 — portion + export](./docs/slices/slice-2.md) ← current
- Stack: Java 17 · Spring Boot · PostgreSQL · React · TypeScript

## Local dev

```bash
docker compose up -d
cd backend
./mvnw spring-boot:run   # Windows: mvnw.cmd
```

API smoke tests: [requests.http](./requests.http)
