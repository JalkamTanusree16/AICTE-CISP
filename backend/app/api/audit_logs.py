from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AuditLog, User
from app.services.auth_service import require_role

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

@router.get("/")
def list_audit_logs(db: Session = Depends(get_db), current_user: User = Depends(require_role(["super_admin", "reviewer"]))):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
