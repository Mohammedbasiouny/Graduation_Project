from fastapi import APIRouter

from api.endpoints.attendance import router as attendance_router
from api.endpoints.photo import router as photo_router
from api.endpoints.system import router as system_router

app_router = APIRouter()

app_router.include_router(photo_router)
app_router.include_router(attendance_router)
app_router.include_router(system_router)