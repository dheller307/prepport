# Slice 2 — Portion calculate + Cronometer export

**Status:** Complete (Jul 2026) · **Next:** [slice 4](./slice-4.md) (+ [slice 5](./slice-5.md) UI) — see [PLAN.md](../../PLAN.md)

**Target:** Jul 24 · Wire `YieldCalculator` into protected APIs; deliver copy-paste export (core product value).

## Done when

- [x] `POST /api/portion/calculate` — `{ batchId, cookedGrams }` → raw equivalent + macros (and totals if multi-line later)
- [x] Chicken scenario: 200 g cooked from batch (2146 raw / 1600 cooked) → **≈268 g raw** equivalent (Cronometer log weight); macros use your ingredient per 100g (smoke: **22.5 P / 0 C / 2.6 F / 120 kcal** per 100g raw from Cronometer)
- [x] `GET /api/portion/export` (or POST with portion lines) — formatted Cronometer-ready text block (`POST /api/portion/export`)
- [x] Endpoints protected (JWT); batch access scoped to logged-in user (same pattern as ingredients)
- [x] `requests.http` updated with calculate + export examples using `Authorization: Bearer …`

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

Learning split:

- **DTOs (`PortionCalculateRequest`, `PortionCalculateResponse`, `PortionExportRequest`)** — you type; mirror `CreateBatchRequest` (records, validation); nested `@Valid` on export `lines` — quick intro when you add it
- **`macro_basis` (RAW vs COOKED)** — quick intro when scaling macros (PLAN raw vs cooked); yield math is the same; basis tells you which per-100g fields to use
- **`YieldCalculator`** — **ready** (Slice 0); you wire from `PortionService`; add carbs/fat/kcal helpers alongside protein if needed
- **`@Service` / `PortionService`** — quick intro (first service layer in the project); you implement calculate + shared logic export reuses
- **Batch lookup scoped to user** — quick intro (`Batch` → `PrepSession` → `User`, or a repository query); you add the repository method and call it from the service
- **`PortionController`** — short intro on thin controllers; you implement `POST /calculate` and export endpoint; pass `@AuthenticationPrincipal User` like existing controllers
- **404 for wrong / other-user batch** — **ready**; same `ResponseStatusException` pattern as ingredients and prep sessions
- **Cronometer export text** — format spec from PLAN (agent brief); you implement string build, per-line raw grams, and meal totals
- **`text/plain` export response** — quick intro (`produces` or `ResponseEntity` content type); JSON only for calculate
- **`PortionServiceTest` (chicken ≈268 g raw)** — you type; prefer unit test on service + calculator without full Spring context
- **`requests.http` (calculate + export with Bearer)** — you write/run
- **JWT on new routes** — **ready**; `SecurityConfig` already uses `anyRequest().authenticated()` — no change unless debugging 401

## API sketch (from PLAN)

```
POST   /api/portion/calculate
POST   /api/portion/export
```

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
