from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import UniversityCurriculum, ReferenceCurriculum, Course, Unit, Comparison, ComparisonItem, User, Setting
from app.services.auth_service import get_current_user
from app.services.comparison_service import run_semantic_comparison
from app.services.audit_service import log_action

router = APIRouter(prefix="/comparisons", tags=["Comparisons"])

class RunComparisonRequest(BaseModel):
    university_curriculum_id: int
    reference_curriculum_id: int

@router.post("/run")
def trigger_comparison(req: RunComparisonRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == req.university_curriculum_id).first()
    if not uc:
        raise HTTPException(status_code=404, detail="University curriculum not found")

    ref = db.query(ReferenceCurriculum).filter(ReferenceCurriculum.id == req.reference_curriculum_id).first()
    if not ref:
        raise HTTPException(status_code=404, detail="Reference curriculum not found")

    # Fetch reference courses & units
    ref_courses = db.query(Course).filter(Course.reference_curriculum_id == ref.id).all()
    ref_data = []
    for c in ref_courses:
        units = db.query(Unit).filter(Unit.course_id == c.id).all()
        ref_data.append({
            "title": c.title,
            "code": c.code,
            "semester": c.semester,
            "taxonomy_tags": c.taxonomy_tags,
            "units": [{"title": u.title, "topics": u.topics} for u in units]
        })

    # Fetch university courses & units
    uni_courses = db.query(Course).filter(Course.university_curriculum_id == uc.id).all()
    uni_data = []
    for c in uni_courses:
        units = db.query(Unit).filter(Unit.course_id == c.id).all()
        uni_data.append({
            "title": c.title,
            "code": c.code,
            "semester": c.semester,
            "taxonomy_tags": c.taxonomy_tags,
            "units": [{"title": u.title, "topics": u.topics} for u in units]
        })

    # Fetch configurable dynamic weights from Settings DB
    settings_db = db.query(Setting).all()
    weights = {s.key: float(s.value) for s in settings_db if s.value.replace('.', '', 1).isdigit()}

    # Run semantic comparison algorithm
    res = run_semantic_comparison(ref_data, uni_data, weights)

    # Save Comparison entity
    db.query(Comparison).filter(Comparison.university_curriculum_id == uc.id).delete()
    db.commit()

    comp = Comparison(
        university_curriculum_id=uc.id,
        reference_curriculum_id=ref.id,
        overall_score=res["overall_score"],
        subject_score=res["subject_score"],
        topic_score=res["topic_score"],
        credit_score=res["credit_score"],
        practical_score=res["practical_score"],
        co_score=res["co_score"],
        emerging_tech_score=res["emerging_tech_score"],
        analysis_json={"method": "TF-IDF Vector Cosine Similarity", "total_evaluated": len(res["items"])}
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)

    # Save Comparison Items
    for item in res["items"]:
        ci = ComparisonItem(
            comparison_id=comp.id,
            ref_course_title=item["ref_course_title"],
            ref_topic=item["ref_topic"],
            uni_course_title=item["uni_course_title"],
            uni_topic=item["uni_topic"],
            similarity_score=item["similarity_score"],
            status=item["status"],
            match_type=item["match_type"],
            evidence_location=item["evidence_location"],
            gap_description=item["gap_description"],
            recommendation=item["recommendation"]
        )
        db.add(ci)

    # Update curriculum overall alignment score
    uc.alignment_score = res["overall_score"]
    uc.reference_curriculum_id = ref.id
    db.commit()

    log_action(db, current_user.id, current_user.email, current_user.role, "RUN_COMPARISON", "COMPARISON", comp.id, f"Executed comparison. Calculated score: {res['overall_score']}%")

    return {
        "comparison_id": comp.id,
        "overall_score": comp.overall_score,
        "subject_score": comp.subject_score,
        "topic_score": comp.topic_score,
        "credit_score": comp.credit_score,
        "practical_score": comp.practical_score,
        "co_score": comp.co_score,
        "emerging_tech_score": comp.emerging_tech_score,
        "items": res["items"]
    }

@router.get("/{uc_id}")
def get_comparison_for_curriculum(uc_id: int, db: Session = Depends(get_db)):
    comp = db.query(Comparison).filter(Comparison.university_curriculum_id == uc_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="No comparison analysis found for this curriculum")

    items = db.query(ComparisonItem).filter(ComparisonItem.comparison_id == comp.id).all()
    return {
        "id": comp.id,
        "university_curriculum_id": comp.university_curriculum_id,
        "reference_curriculum_id": comp.reference_curriculum_id,
        "overall_score": comp.overall_score,
        "subject_score": comp.subject_score,
        "topic_score": comp.topic_score,
        "credit_score": comp.credit_score,
        "practical_score": comp.practical_score,
        "co_score": comp.co_score,
        "emerging_tech_score": comp.emerging_tech_score,
        "created_at": comp.created_at.isoformat() if comp.created_at else None,
        "items": [
            {
                "id": i.id,
                "ref_course_title": i.ref_course_title,
                "ref_topic": i.ref_topic,
                "uni_course_title": i.uni_course_title,
                "uni_topic": i.uni_topic,
                "similarity_score": i.similarity_score,
                "status": i.status,
                "match_type": i.match_type,
                "evidence_location": i.evidence_location,
                "gap_description": i.gap_description,
                "recommendation": i.recommendation
            } for i in items
        ]
    }
