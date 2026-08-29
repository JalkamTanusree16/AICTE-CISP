from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import University, User
from app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/universities", tags=["Universities"])

class UniversityCreate(BaseModel):
    code: str
    name: str
    state: str
    type: str
    address: Optional[str] = None
    website: Optional[str] = None

@router.get("/")
def list_universities(state: Optional[str] = None, type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(University)
    if state:
        query = query.filter(University.state == state)
    if type:
        query = query.filter(University.type == type)
    return query.all()

@router.get("/{uni_id}")
def get_university(uni_id: int, db: Session = Depends(get_db)):
    uni = db.query(University).filter(University.id == uni_id).first()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")
    return uni

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_university(data: UniversityCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["super_admin"]))):
    existing = db.query(University).filter(University.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="University code already exists")
    uni = University(**data.dict())
    db.add(uni)
    db.commit()
    db.refresh(uni)
    return uni
