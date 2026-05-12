# UDORM

UDORM is a multi-service university housing platform with:

- `backend`: NestJS + Prisma API
- `frontend`: React + Vite web app
- `ID-Card-Detection`: FastAPI service for ID-card and photo validation
- `udorm-attendance-service`: FastAPI service for face recognition and attendance

## Quick Start

Run the full stack with Docker:

```powershell
docker-compose up -d --build
```

Then open:

- Frontend: `http://localhost:3030`
- Backend API: `http://localhost:3000`
- ID-card AI: `http://localhost:8000/docs`
- Attendance AI: `http://localhost:8001/status`

## Health Check

Use the bundled script to verify the whole system:

```powershell
powershell -ExecutionPolicy Bypass -File tools/check-system.ps1
```

The backend also exposes a unified health endpoint:

- `GET /api/health`
- `GET /api/health/services`

## Environment Files

Copy the example files before running locally:

- `backend/.env.example`
- `frontend/.env.example`
- `ID-Card-Detection/.env.example`
- `udorm-attendance-service/.env.example`

Keep real secrets out of Git. Use local `.env` files only.
