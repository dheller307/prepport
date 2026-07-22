# Slice 1b — JWT auth

**Status:** Complete (Jul 2026) · **Next:** [slice-2](./slice-2.md)

**Target:** Jul 6–10 (revised: late Jul 2026) · Add register/login and protect existing APIs.

Done when:

- [x] `POST /api/auth/register` creates a user (email + password)
- [x] `POST /api/auth/login` returns a JWT on valid credentials
- [x] Protected routes return `401 or 403` without a token
- [x] Ingredients and prep sessions are scoped to the logged-in user (`user_id`)
- [x] `requests.http` has register, login, and one authenticated call (e.g. create ingredient with `Authorization: Bearer …`)

Work order:

1. Add Spring Security + JWT dependencies to `backend/pom.xml`.
2. Create `User` entity + `UserRepository` (`email`, `password_hash`, `created_at`).
3. Agent scaffolds Security config, JWT filter/service — **read before editing**.
4. Implement `AuthController` (register + login).
5. Add `user_id` to `Ingredient` and `PrepSession`; filter queries by current user.
6. Update `requests.http`, smoke-test full flow, commit.

Learning split:

- Spring Security overview — short intro (filter chain, what's authenticated vs public)
- Security config + JWT filter — **scaffold + study** (agent provides; you read how it fits)
- Password hashing (`BCryptPasswordEncoder`) — quick intro
- `AuthController` — you implement register/login with agent walkthrough
- `user_id` on entities — you add `@ManyToOne User` and update controllers
- Wiring JWT to `requests.http` — you write/run requests

Files to create:

- `backend/src/main/java/com/prepport/entity/User.java`
- `backend/src/main/java/com/prepport/repository/UserRepository.java`
- `backend/src/main/java/com/prepport/controller/AuthController.java`
- `backend/src/main/java/com/prepport/security/SecurityConfig.java` (or `config/`)
- `backend/src/main/java/com/prepport/security/JwtService.java`
- `backend/src/main/java/com/prepport/security/JwtAuthFilter.java` (or similar)
- DTOs as needed: `RegisterRequest`, `LoginRequest`, `AuthResponse` (optional but cleaner)

Likely edits:

- `backend/pom.xml` — `spring-boot-starter-security`, JWT library (e.g. `jjwt` or `nimbus-jose-jwt`)
- `Ingredient.java`, `PrepSession.java` — add `user_id` / `@ManyToOne User`
- `IngredientController`, `PrepSessionController` — scope reads/writes to authenticated user
- `application.properties` — JWT secret, expiry (use env var placeholder for prod)
- `requests.http` — auth section at top; bearer token on protected calls

API sketch (from PLAN):

```
POST   /api/auth/register
POST   /api/auth/login
```

Public (no auth): `/health`, `/api/auth/**`

Protected: all `/api/ingredients/**`, `/api/prep-sessions/**`, future portion/export routes.

Not in scope: React login UI, refresh tokens, OAuth, email verification, password reset, role-based admin, production deploy hardening (basic secret in properties is OK for local dev).

First commit-sized step: add Security + JWT deps, scaffold `User` entity and `UserRepository`, then register one user via a temporary endpoint or integration test before protecting routes.

## Also shipped (beyond checklist)

- `CreateBatchRequest` DTO for batch create (validation + `ingredientId`)
- Ingredient ownership verified on `POST .../batches`
- `JwtAuthFilter` principal = `User` entity (for `@AuthenticationPrincipal`)
- PLAN updated: MVP batches always record raw + cooked weights