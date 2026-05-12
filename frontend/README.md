# UDORM Frontend

React + Vite web app for the UDORM housing platform.

## Structure

- `src/assets` - logos, fonts, images, and seed data
- `src/components` - reusable UI and layout components
- `src/hooks` - API hooks and shared hooks
- `src/pages` - route-level screens
- `src/routes` - route definitions and guards
- `src/services` - API clients for backend and AI services
- `src/store` - global state management
- `src/styles` - global styles and fonts
- `src/utils` - helpers and formatting logic
- `src/validation` - form and data validation rules

## Run

### Docker

From the repository root:

```powershell
docker-compose up -d --build
```

### Local Development

```powershell
cd frontend
npm install
Copy-Item .env.example .env.production
npm run dev
```

## Environment

For Docker builds the app reads `frontend/.env.production`.

For local work use `frontend/.env.example` as the template.

Important variables:

- `VITE_API_BASE_URL`
- `VITE_API_ATTENDANCE_URL`
- `VITE_WS_ATTENDANCE_URL`
- `VITE_API_AI_TASKS_URL`
- `VITE_WS_AI_TASKS_URL`

## Notes

- The app is RTL-ready and localized for Arabic and English.
- API URLs must point to host-accessible addresses when running in a browser.
- The frontend can be built and served through Docker or run directly with Vite.