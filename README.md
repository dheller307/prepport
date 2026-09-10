# PrepPort

PrepPort is a meal-prep companion that converts cooked serving weights back to raw-weight equivalents, so users can log macros and calories from the original nutrition data rather than generic cooked-food estimates.

Build ingredient batches from raw and cooked weights, assemble meals from those batches, track what remains, and generate copyable nutrition summaries for logging.

[Live Demo](https://prepport.duckdns.org)

## Why PrepPort?

Cooking changes food weight. For example, 1,000 g of raw chicken might become 750 g after cooking. If you eat 150 g of that cooked chicken, PrepPort converts it to:

```text
150 g cooked × (1,000 g raw / 750 g cooked) = 200 g raw equivalent
```

That lets PrepPort calculate the serving's nutrition from the original raw entry when appropriate, while still supporting ingredients whose nutrition data is based on cooked weight.

## Features

- Create ingredients with per-100 g nutrition data and a raw/cooked macro basis.
- Record raw and cooked batch weights to calculate food yield.
- Build and save multi-ingredient meals from prepared batches.
- Convert cooked portions to raw-weight equivalents and calculate nutrition.
- Track meal history and remaining cooked batch inventory.
- Generate copyable nutrition summaries, with user-scoped data protected by JWT authentication.

## How PrepPort Works

PrepPort stores both the raw and cooked weight of each batch and calculates its yield:

```text
yield ratio = cooked batch weight / raw batch weight
```

For ingredients whose nutrition data is based on raw food, the cooked serving is converted back to raw-equivalent grams before macros are calculated:

```text
raw equivalent = cooked serving × raw batch weight / cooked batch weight
macros = nutrition per 100 g × macro-reference grams / 100
```

For ingredients whose nutrition data is already based on cooked food, PrepPort uses the cooked serving weight directly.

## Architecture

```text
React + TypeScript SPA
        │ REST / JSON + JWT
        ▼
Spring Boot API
        │ JPA
        ▼
PostgreSQL
```

Core data relationships:

```text
User
├── Ingredients
├── Prep Sessions
│   └── Batches
│       └── raw weight, cooked weight, ingredient
└── Saved Meals
    └── Meal lines
        └── batch + cooked grams
```

Protected API requests use the authenticated user, and repository queries scope records to that user.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Java 17, Spring Boot 3, Spring Security, Spring Data JPA
- **Database:** PostgreSQL 16
- **Testing:** JUnit 5, Mockito
- **Infrastructure:** Docker, Docker Compose, AWS Lightsail

## Engineering Highlights

- `YieldCalculator` isolates raw-to-cooked conversion and nutrition-scaling logic.
- `PortionLogService` merges duplicate batch entries before inventory validation to prevent over-allocation.
- Remaining cooked inventory is derived from saved meal history rather than maintained as a separate mutable counter.
- Protected endpoints use JWT authentication and user-scoped repository queries, while centralized error handling returns readable validation and integrity messages.

## Running Locally

```bash
docker compose up -d

cd backend
./mvnw spring-boot:run

cd ../frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8080` in `frontend/.env.local`.

## Testing

Run backend tests:

```bash
cd backend
./mvnw test
```

The backend includes focused tests for:

- yield and macro calculations;
- portion calculation behavior;
- prep-session deletion impact and force-delete rules;
- batch and ingredient reference guards;
- preventing batch cooked weights from falling below recorded meal usage.

Run frontend formatting and a production build:

```bash
cd frontend
npm run format:check
npm run build
```

Run backend formatting checks:

```bash
cd backend
./mvnw spotless:check
```

## Deployment

PrepPort is deployed at [prepport.duckdns.org](https://prepport.duckdns.org).

The current deployment uses an AWS Lightsail Linux instance. The Spring Boot API and PostgreSQL database run in Docker containers with Docker Compose, while the React frontend is built separately and configured to use the deployed API.
