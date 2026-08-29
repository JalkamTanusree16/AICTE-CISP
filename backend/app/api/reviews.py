from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import Review, Comment, UniversityCurriculum, University, Program, User
from app.services.auth_service import require_role, get_current_user
from app.services.audit_service import log_action

router = APIRouter(prefix="/reviews", tags=["Reviews"])

class CommentCreate(BaseModel):
    course_id: Optional[int] = None
    text: str

class ReviewDecisionRequest(BaseModel):
    decision: str # APPROVED, CHANGES_REQUESTED, REJECTED
    comments: Optional[str] = None

@router.get("/queue")
def get_review_queue(db: Session = Depends(get_db), current_user: User = Depends(require_role(["reviewer", "super_admin"]))):
    curricula = db.query(UniversityCurriculum).filter(UniversityCurriculum.status.in_(["UNDER_REVIEW", "SUBMITTED"])).all()
    queue = []
    for uc in curricula:
        uni = db.query(University).filter(University.id == uc.university_id).first()
        prog = db.query(Program).filter(Program.id == uc.program_id).first()
        queue.append({
            "id": uc.id,
            "university_name": uni.name if uni else "—",
            "state": uni.state if uni else "—",
            "program_name": prog.name if prog else "—",
            "branch": prog.branch if prog else "—",
            "academic_year": uc.academic_year,
            "version": uc.version,
            "status": uc.status,
            "alignment_score": uc.alignment_score,
            "submitted_at": uc.submitted_at.isoformat() if uc.submitted_at else None
        })
    return queue

@router.post("/{uc_id}/decision")
def submit_review_decision(uc_id: int, req: ReviewDecisionRequest, db: Session = Depends(get_db), current_user: User = Depends(require_role(["reviewer", "super_admin"]))):
    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == uc_id).first()
    if not uc:
        raise HTTPException(status_code=404, detail="Curriculum submission not found")

    rev = db.query(Review).filter(Review.university_curriculum_id == uc.id).first()
    if not rev:
        rev = Review(university_curriculum_id=uc.id, reviewer_id=current_user.id)
        db.add(rev)
        db.commit()

    rev.status = req.decision
    rev.decision = req.decision
    rev.comments = req.comments

    if req.decision == "APPROVED":
        uc.status = "APPROVED"
    elif req.decision == "CHANGES_REQUESTED":
        uc.status = "CHANGES_REQUESTED"
    elif req.decision == "REJECTED":
        uc.status = "REJECTED"

    db.commit()
    log_action(db, current_user.id, current_user.email, current_user.role, "REVIEW_DECISION", "CURRICULUM", uc.id, f"Review decision: {req.decision}")
    return {"message": f"Review decision saved: {req.decision}", "status": uc.status}

@router.get("/{uc_id}/comments")
def get_curriculum_comments(uc_id: int, db: Session = Depends(get_db)):
    rev = db.query(Review).filter(Review.university_curriculum_id == uc_id).first()
    if not rev:
        return []
    comments = db.query(Comment).filter(Comment.review_id == rev.id).all()
    return [{
        "id": c.id,
        "author_name": c.author_name,
        "course_id": c.course_id,
        "text": c.text,
        "created_at": c.created_at.isoformat()
    } for c in comments]

@router.post("/{uc_id}/comments")
def add_curriculum_comment(uc_id: int, req: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rev = db.query(Review).filter(Review.university_curriculum_id == uc_id).first()
    if not rev:
        rev = Review(university_curriculum_id=uc_id, reviewer_id=current_user.id)
        db.add(rev)
        db.commit()

    comment = Comment(
        review_id=rev.id,
        author_id=current_user.id,
        author_name=current_user.full_name,
        course_id=req.course_id,
        text=req.text
    )
    db.add(comment)
    db.commit()
    return {"message": "Comment added successfully", "id": comment.id}
