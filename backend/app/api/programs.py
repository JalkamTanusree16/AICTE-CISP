from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import Program, User
from app.services.auth_service import require_role

router = APIRouter(prefix="/programs", tags=["Programs"])

class ProgramCreate(BaseModel):
    code: str
    name: str
    degree_level: str
    branch: str
    duration_years: int = 4
    total_credits: int = 160

@router.get("/")
def list_programs(degree_level: str = None, db: Session = Depends(get_db)):
    query = db.query(Program)
    if degree_level:
        query = query.filter(Program.degree_level == degree_level)
    return query.all()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_program(data: ProgramCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["super_admin"]))):
    prog = Program(**data.dict())
    db.add(prog)
    db.commit()
    db.refresh(prog)
    return prog
