from sqlalchemy.orm import Session
from app.db.models import AuditLog

def log_action(
    db: Session,
    user_id: int,
    user_email: str,
    user_role: str,
    action: str,
    entity_type: str,
    entity_id: int = None,
    details: str = None
):
    """
    Logs every important administrative, review, submission, or approval event.
    """
    try:
        log_entry = AuditLog(
            user_id=user_id,
            user_email=user_email,
            user_role=user_role,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Audit log failed: {e}")
