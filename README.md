# UDORM

UDORM is a multi-service university housing platform with:

- `backend`: NestJS + Prisma API
- `frontend`: React + Vite web app
- `ID-Card-Detection`: FastAPI service for ID-card and photo validation
- `udorm-attendance-service`: FastAPI service for face recognition and attendance

## Team Workflow (Docker First)

Use Docker as the default team workflow.

### 1) Start the full stack

Run the full stack with Docker:

```powershell
docker-compose up -d --build
```

### 2) Seed the database

Run seed inside the backend container:

```powershell
docker-compose exec backend npx prisma db seed
```

### 3) Open services

Then open:

- Frontend: `http://localhost:3030`
- Backend API: `http://localhost:3000`
- ID-card AI: `http://localhost:8000/docs`
- Attendance AI: `http://localhost:8001/status`

### 4) Verify system health

Use the bundled script:

```powershell
powershell -ExecutionPolicy Bypass -File tools/check-system.ps1
```

Backend health endpoints:

- `GET /api/health`
- `GET /api/health/services`

## Seed Data

Test data is included under `backend/prisma/data/`.
The seed entrypoint is `backend/prisma/seed.ts`.

The seed command populates admin divisions, buildings, faculties, application periods, users, students, and related documents.

## Common Docker Notes

- Do not run `npm run seed` from repository root (`package.json` does not exist there).
- Prefer `docker-compose exec backend npx prisma db seed` for team consistency.
- The backend image is production-like, so avoid relying on host-only tooling inside containers.
- `udorm-attendance-service` preloads the InsightFace model during build; first build may take longer.

To monitor attendance startup logs:

```powershell
docker-compose logs -f udorm-attendance-service
```

## Environment Files

Copy the example files before running locally:

- `backend/.env.example`
- `frontend/.env.example`
- `ID-Card-Detection/.env.example`
- `udorm-attendance-service/.env.example`

Keep real secrets out of Git. Use local `.env` files only.
