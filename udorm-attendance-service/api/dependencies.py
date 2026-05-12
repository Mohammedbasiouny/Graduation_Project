from sqlalchemy.orm import Session
from fastapi import Depends

from database.connection import get_db

# ================================
# Database Session
# ================================

def get_database_session(db: Session = Depends(get_db)) -> Session:
    return db