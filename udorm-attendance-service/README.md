# udorm-attendance-service

FastAPI AI service for face validation, live enrollment, and attendance recognition.

## What It Does

- Validates student photos before they are accepted into the system
- Loads embeddings and attendance state into Redis on startup
- Recognizes faces from frames sent by the frontend
- Supports live enrollment and system reset flows used by the NestJS backend

## Structure

- `main.py` - FastAPI app, lifecycle, CORS, and root health check
- `api/` - routers and HTTP/WebSocket endpoints
- `config/` - service settings
- `core/` - face detection, embedding, matching, and validation logic
- `database/` - SQLAlchemy connection, models, and queries
- `memory/` - Redis cache and client helpers
- `schemas/` - request and response models
- `services/` - attendance, enrollment, and validation orchestration
- `workers/` - attendance consumer worker
- `utils/` - logging and image helpers
- `deploy/` - optional nginx config for production

## Important Endpoints

- `GET /`
- `GET /status`
- `POST /validate-photo`
- `POST /hydrate-memory`
- `POST /reset-system`
- `WS /ws/recognize`
- `WS /ws/enroll/{student_id}`
- `POST /unenroll-student`

## Run

### Docker

From the repository root:

```powershell
docker-compose up -d --build
```

### Local Development

```powershell
cd udorm-attendance-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python main.py
```

For production mode, use the service startup script:

```powershell
bash start.sh
```

## Environment

Use `udorm-attendance-service/.env` locally.

The template is `udorm-attendance-service/.env.example`.

## Notes

- Redis and PostgreSQL must be available.
- The service expects the same database used by `backend/`.
- The frontend connects to `/status`, enrollment WebSockets, and recognition WebSockets.
