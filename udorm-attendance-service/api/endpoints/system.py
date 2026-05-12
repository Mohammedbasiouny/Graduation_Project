from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.dependencies import get_database_session
from schemas.system import (
    HydrateMemoryRequest,
    HydrateMemoryResponse,
    ResetSystemResponse,
)
from services.attendance_service import hydrate_memory, reset_system

router = APIRouter(tags=["System"])

# ================================
# POST /hydrate-memory
# called by NestJS only — not by React directly.
# ================================
@router.post("/hydrate-memory", response_model=HydrateMemoryResponse)
async def hydrate_memory_endpoint(
    request: HydrateMemoryRequest,
    db:      Session = Depends(get_database_session),
):
    return await hydrate_memory(request, db)


# ================================
# POST /reset-system
# called by NestJS only — not by React directly.
# ================================
@router.post("/reset-system", response_model=ResetSystemResponse)
async def reset_system_endpoint(db: Session = Depends(get_database_session)):

    return await reset_system(db)