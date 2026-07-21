# Slice 0 — Yield math (plain Java)

**Status:** Complete (Jul 2026)

**Target:** Jun 29 · Pure domain math — no Spring, no DB, no UI.

Done when:
- [x] `yieldRatio(2146, 1600)` ≈ `0.746` (cooked ÷ raw)
- [x] `rawEquivalentG(200, 2146, 1600)` ≈ `268` g (Cronometer raw weight for a cooked scoop)
- [x] `proteinForCookedPortion(200, 2146, 1600, 31.0)` ≈ `83` g (31 g protein / 100 g raw)
- [x] JUnit suite green via `./mvnw test` from `backend/`
- [x] Chicken scenario documented as a comment or `@DisplayName` in the test class

Files to create:
- `backend/pom.xml` — Java 17, JUnit 5 only (no Spring yet)
- `backend/src/main/java/com/prepport/yield/YieldCalculator.java`
- `backend/src/test/java/com/prepport/yield/YieldCalculatorTest.java`

Not in scope: Spring Boot, REST, Postgres, entities, carbs/fat/kcal helpers, export strings, React.

First commit-sized step: scaffold `backend/` with a minimal `pom.xml` and one failing test asserting `rawEquivalentG(200, 2146, 1600) == 268` (tolerance OK) against an empty `YieldCalculator`.
