from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import Setting, User
from app.services.auth_service import require_role

router = APIRouter(prefix="/settings", tags=["Settings"])

class WeightUpdate(BaseModel):
    weight_subject: float
    weight_topic: float
    weight_credit: float
    weight_practical: float
    weight_co: float
    weight_emerging_tech: float

@router.get("/")
def get_settings(db: Session = Depends(get_db)):
    settings_db = db.query(Setting).all()
    return {s.key: s.value for s in settings_db}

@router.put("/weights")
def update_scoring_weights(weights: WeightUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["super_admin"]))):
    mapping = {
        "weight_subject": str(weights.weight_subject),
        "weight_topic": str(weights.weight_topic),
        "weight_credit": str(weights.weight_credit),
        "weight_practical": str(weights.weight_practical),
        "weight_co": str(weights.weight_co),
        "weight_emerging_tech": str(weights.weight_emerging_tech),
    }

    for key, val in mapping.items():
        s = db.query(Setting).filter(Setting.key == key).first()
        if s:
            s.value = val
        else:
            db.add(Setting(key=key, value=val, description="AICTE Alignment Scoring Weight"))
    db.commit()
    return {"message": "AICTE Alignment Scoring Weights updated successfully"}
