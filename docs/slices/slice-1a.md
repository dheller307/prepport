# Slice 1a — Backend CRUD (no auth)

**Status:** Complete (Jul 2026) · **Next:** [slice-1b](./slice-1b.md)

**Target:** Jul 6 · Spring Boot backend with Postgres-backed CRUD. Single-user/dev mode only.

Done when:

- [x] `GET /health` returns `200 OK` with a simple response like `OK` or `{ "status": "ok" }`
- [x] Ingredients CRUD works: create, list, update, delete an ingredient with manual macro fields
- [x] Prep sessions + batches work: create a prep session, add a batch with raw/cooked weights, and read it back
- [x] Postgres runs via Docker Compose and the app connects to it locally
- [x] `requests.http` contains at least 3 working calls: health, create ingredient, create/read batch

Work order:

1. Convert `backend/pom.xml` to a Spring Boot project and get `PrepPortApplication` compiling.
2. Add `HealthController`, run the app, and verify `GET /health` before touching the database.
3. Add `docker-compose.yml` for Postgres, then wire `application.properties` until Spring connects cleanly.
4. Build Ingredient first: entity → repository → controller → test with `requests.http`.
5. Build PrepSession and Batch next, keeping the first pass simple enough to dogfood one Sunday chicken batch.
6. Re-run the `requests.http` calls, then check the done boxes and commit the slice.

Learning split:

- Spring Boot app startup — boilerplate + explanation
- `@RestController`, `@GetMapping` — short intro + walkthrough
- JPA entities — short intro, then you type the fields/mappings
- Repositories — scaffold one, then repeat the pattern
- Docker Postgres — scaffold + explanation
- HTTP requests — you write/run `requests.http`
- Error debugging — pair on real compiler/runtime output

Files to create:

- `backend/src/main/java/com/prepport/PrepPortApplication.java` — Spring Boot entry point
- `backend/src/main/java/com/prepport/controller/HealthController.java`
- `backend/src/main/java/com/prepport/entity/Ingredient.java`
- `backend/src/main/java/com/prepport/entity/PrepSession.java`
- `backend/src/main/java/com/prepport/entity/Batch.java`
- `backend/src/main/java/com/prepport/repository/IngredientRepository.java`
- `backend/src/main/java/com/prepport/repository/PrepSessionRepository.java`
- `backend/src/main/java/com/prepport/repository/BatchRepository.java`
- `backend/src/main/java/com/prepport/controller/IngredientController.java`
- `backend/src/main/java/com/prepport/controller/PrepSessionController.java`
- `backend/src/main/resources/application.properties`
- `docker-compose.yml`
- `requests.http`

Likely edits:

- `backend/pom.xml` — convert from plain JUnit Maven project to Spring Boot with Web, Data JPA, PostgreSQL driver, validation, and tests
- Existing `YieldCalculator` can stay as plain Java for now; do not wire it into CRUD unless needed

Suggested package shape:

- `controller` — HTTP endpoints only
- `entity` — database-backed JPA classes
- `repository` — Spring Data interfaces
- `dto` — optional if request/response shapes start feeling messy; okay to defer for first pass
- `yield` or `service` — pure math/domain logic

Not in scope: JWT/auth, React, Cronometer export, portion builder, meal templates, USDA/search/templates, polished validation, production deploy.

Also shipped: Maven Wrapper (`backend/mvnw`) for laptop/desktop parity.

First commit-sized step: upgrade `backend/pom.xml` to Spring Boot, add `PrepPortApplication` and `HealthController`, then verify `GET /health` works locally before adding entities.