from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Notice

router = APIRouter(prefix="/notices", tags=["Notices"])

@router.get("/")
def list_notices(db: Session = Depends(get_db)):
    return db.query(Notice).order_by(Notice.created_at.desc()).all()
