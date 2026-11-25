# PrepPort

A generic cooked-chicken entry in a nutrition tracker assumes a cooking yield that can differ from yours. Roasting and grilling can remove different amounts of moisture, so two portions with the same cooked weight can represent different raw weights.

PrepPort is a meal-prep app that uses your measured batch weights to calculate how much to log against the raw nutrition entry. If 1,000 g of raw chicken cooks down to 750 g, a 150 g cooked portion corresponds to **200 g raw**. If another 1,000 g batch cooks down to 600 g, a serving of the same cooked weight corresponds to **250 g raw**.

**[Live demo](https://prepport.vercel.app)**

The first API request after inactivity can take about a minute while the backend starts due to Render's Free Tier behavior.

## How it works

**1. Define ingredients.** Store nutrition per 100 g using raw or cooked food values, depending on the nutritional reference.

![Ingredient list showing raw and cooked nutrition entries](assets/readme/ingredients.png)

**2. Track prep batches.** Record raw and cooked weights to calculate cooking yield, remaining inventory, and meal usage history.

![Prep session showing batch weights, yield, remaining inventory, and meal history](assets/readme/prep-session.png)

<!-- Add steps 3 and 4 with the Meal Builder screenshots here. -->

The Meal Builder combines weighed portions from your batches, calculates macros and calories, and produces a copyable summary.

For ingredients with nutrition values based on cooked food, PrepPort uses the portion’s cooked weight directly.

## Architecture

```mermaid
flowchart LR
    UI["React + TypeScript SPA<br/>Vite build on Vercel"]
    API["Dockerized Spring Boot API<br/>Java 17 on Render"]
    DB[("PostgreSQL 16<br/>Neon")]
    UI -->|HTTPS REST + JWT| API
    API -->|Spring Data JPA| DB
```

Spring Boot controllers handle HTTP requests, services apply meal and nutrition rules, and Spring Data repositories access PostgreSQL. The same nutrition calculation powers meal previews, saved meals, and copyable summaries, keeping results consistent. Spring Security verifies JWTs, and repository queries scope protected records to the signed-in user.

## Data model

```mermaid
erDiagram
    USER ||..o{ INGREDIENT : defines
    USER ||..o{ PREP_SESSION : records
    USER ||..o{ SAVED_MEAL : logs
    PREP_SESSION ||..o{ BATCH : contains
    INGREDIENT ||..o{ BATCH : describes
    SAVED_MEAL ||..|{ MEAL_LINE : contains
    BATCH ||..o{ MEAL_LINE : supplies
```

- A **batch** records the raw and cooked weights of one preparation of an ingredient.
- A **prep session** groups batches prepared together.
- A **meal line** records the cooked grams taken from one batch.
- A **saved meal** is a dated collection of meal lines that can draw from different prep sessions.

A Sunday prep session can group chicken and broccoli together. Wednesday’s lunch can use that chicken alongside rice cooked on Tuesday. Each meal line points back to its source batch, so PrepPort can use that batch’s measured yield when converting a portion to raw weight.

## Engineering details

- **Inventory derived from meal history.** Remaining cooked weight is the batch’s cooked weight minus the total recorded on its meal lines. Editing or deleting a meal changes that total without maintaining a separate inventory counter.
- **Validation before saving.** The API combines repeated portions from the same batch before checking available inventory. When editing a meal, its previous portions are credited back before validating the new amounts.
- **Dependency-aware deletion.** Before deleting a prep session, the app warns how many saved meals depend on it and requires confirmation. The API then deletes the session, its batches, and the affected saved meals in one transaction.
- **Backend tests.** Coverage includes yield and macro calculations, missing batches, batch weight changes, and deletion rules for referenced records.
