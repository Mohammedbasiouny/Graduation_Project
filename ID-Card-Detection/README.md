# ID-Card-Detection

FastAPI service for Egyptian ID-card validation and Word generation.

## What It Does

- Validates whether an uploaded image looks like an Egyptian ID card
- Processes and normalizes ID-card images
- Generates Word documents from ZIP archives of student folders
- Streams task progress through Redis-backed workers and WebSockets

## Structure

- `main.py` - FastAPI application and HTTP/WebSocket routes
- `config.py` - environment settings
- `services/` - Redis, task, validation, cleanup, and worker orchestration
- `utils/` - image helpers, logging, ZIP helpers, progress helpers
- `workers/` - background Word-generation workers
- `images/` - template and sample images
- `models/` - local YOLO model weights

## Important Endpoints

- `POST /check-egyptian-id/`
- `POST /process-id-image/`
- `POST /generate-word`
- `GET /tasks`
- `GET /tasks/{task_id}`
- `GET /tasks/{task_id}/download`

Open the docs at:

```text
http://localhost:8000/docs
```

## Run

### Docker

From the repository root:

```powershell
docker-compose up -d --build
```

### Local Development

```powershell
cd ID-Card-Detection
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Environment

Use `ID-Card-Detection/.env` locally.

The template is `ID-Card-Detection/.env.example`.

## Notes

- Redis is required for task state and worker coordination.
- Keep the model file at `models/detect_id_card.pt`.
- Keep the template image at `images/sift_template.jpg`.
