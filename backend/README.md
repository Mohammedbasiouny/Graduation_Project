# UDORM Backend

NestJS + Prisma API for the UDORM housing platform.

## What It Handles

- Authentication and activation flows
- Users and permissions
- Application dates and settings
- Student registration and profiles
- Academics, dormitory, restaurant, and residents management
- Integration with the AI services in `ID-Card-Detection/` and `udorm-attendance-service/`

## Structure

- `src/modules/auth` - signup, signin, password reset, email change
- `src/modules/application-dates` - application period and admin controls
- `src/modules/student` - student registration and medical data
- `src/modules/admin` - admin management and acceptance flows
- `src/modules/attendance` - Nest-side attendance integration
- `src/modules/restaurant`, `src/modules/dormitory`, `src/modules/academics`, `src/modules/locations` - core domain modules
- `src/modules/health` - unified health endpoint for the stack

## Run

### Docker

From the repository root:

```powershell
docker-compose up -d --build
```

Seed the database inside the backend container:

```powershell
docker-compose exec backend npx prisma db seed
```

Important Docker notes:

- The backend container is built without dev dependencies, so the seed runner is configured with `tsx` and works directly inside Docker.
- The Docker database hostname is `postgres`, not `localhost`.
- The attendance service image preloads its face-recognition model during build, so runtime startup is faster. The first Docker build may take longer because it downloads the model once.

### Local Development

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run start:dev
```

## Environment

Use `backend/.env` locally and keep the real values out of public repos.

The safe template is `backend/.env.example`.

For Docker, the compose file supplies service hostnames such as `postgres`, `redis`, `backend`, and `id-card-detection`. Keep those names intact when running the stack inside containers.

## Useful Endpoints

- `GET /api/health`
- `GET /api/health/services`
- `GET /api/application-dates/period/status`
- `GET /api/application-dates/current-period`
- `POST /api/signup`
- `POST /api/signin`
