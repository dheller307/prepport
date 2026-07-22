# Slice 2 — Portion calculate + Cronometer export

**Status:** Not started · **Next after:** [slice-1b](./slice-1b.md) ✓

**Target:** Jul 24 · Wire `YieldCalculator` into protected APIs; deliver copy-paste export (core product value).

## Done when

- [ ] `POST /api/portion/calculate` — `{ batchId, cookedGrams }` → raw equivalent + macros (and totals if multi-line later)
- [ ] Chicken scenario: 200 g cooked from batch (2146 raw / 1600 cooked) → **≈268 g raw** equivalent
- [ ] `GET /api/portion/export` (or POST with portion lines) — formatted Cronometer-ready text block
- [ ] Endpoints protected (JWT); batch access scoped to logged-in user (same pattern as ingredients)
- [ ] `requests.http` updated with calculate + export examples using `Authorization: Bearer …`

## Context from slice 1b (read first)

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login` → JWT; public routes `/health`, `/api/auth/**`
- **Security:** `SecurityConfig`, `JwtAuthFilter` (principal = `User` entity), `JwtService`
- **User scoping:** `@AuthenticationPrincipal User`; `findByIdAndUser` on ingredients and prep sessions
- **Batch create:** `POST /api/prep-sessions/{id}/batches` with `CreateBatchRequest` (`ingredientId`, `rawWeightG`, `cookedWeightG` — both required)
- **Domain:** All MVP batches use raw + cooked weigh-in (rice same as chicken); see PLAN raw vs cooked section
- **Smoke file:** [requests.http](../../requests.http) — full auth + CRUD flow

## Existing code to reuse

- `com.prepport.yield.YieldCalculator` — `rawEquivalentG`, macro helpers (Slice 0 tests)
- `Batch` → `Ingredient` (`macroBasis`, macros per 100g), `PrepSession` → `User`
- Ingredient macros stored per 100g on declared basis (`RAW` or `COOKED`)

## Work order (suggested)

1. Decide request/response DTOs for calculate (e.g. `PortionCalculateRequest`, `PortionCalculateResponse`).
2. `PortionService` (or controller + calculator): load batch by id **and** user; pull raw/cooked batch weights + ingredient macros; call `YieldCalculator`.
3. `PortionController` — `POST /api/portion/calculate`; add route to `SecurityConfig` protected set (already `anyRequest().authenticated()`).
4. Export: define text format (see PLAN example); `GET` or `POST` with portion line(s).
5. JUnit tests for calculate path (chicken numbers); update `requests.http`.

## API sketch (from PLAN)

```
POST   /api/portion/calculate
GET    /api/portion/export
```

## Learning split

- **YieldCalculator integration** — you wire; math already tested in Slice 0
- **Service layer** — quick intro if first `@Service` in project
- **DTOs for calculate response** — you define fields (rawEquivalentG, protein, carbs, fat, kcal)
- **Export string formatting** — you implement; plain Java string build is fine

## Not in scope

- React portion builder UI (Slice 4–5)
- Meal templates (Slice 6)
- Post-cook add-ins / composite batches (post-MVP)
- CSV export (Phase 2)

## Local dev reminder

```bash
docker compose up -d
cd backend && ./mvnw spring-boot:run
```

JWT: `prepport.jwt.secret` in [application.properties](../../backend/src/main/resources/application.properties) (env `JWT_SECRET` optional override).
