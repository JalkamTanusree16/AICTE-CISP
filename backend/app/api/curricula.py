from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import ReferenceCurriculum, UniversityCurriculum, Course, Unit, CourseOutcome, User, Program, University
from app.services.auth_service import get_current_user, require_role
from app.services.audit_service import log_action

router = APIRouter(prefix="/curricula", tags=["Curricula"])

class UnitSchema(BaseModel):
    unit_number: int
    title: str
    hours: int = 8
    topics: str

class CourseCreate(BaseModel):
    semester: int
    code: str
    title: str
    course_type: str = "CORE"
    credits: float = 4.0
    lecture_hours: int = 3
    tutorial_hours: int = 1
    practical_hours: int = 2
    prerequisites: Optional[str] = None
    objectives: Optional[str] = None
    taxonomy_tags: Optional[str] = None
    units: Optional[List[UnitSchema]] = []

class ReferenceCurriculumCreate(BaseModel):
    program_id: int
    academic_year: str
    version: str = "v1.0"
    description: Optional[str] = None
    courses: Optional[List[CourseCreate]] = []

class UniversityCurriculumCreate(BaseModel):
    university_id: int
    program_id: int
    reference_curriculum_id: Optional[int] = None
    academic_year: str
    version: str = "v1.0"

@router.get("/reference")
def list_reference_curricula(program_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(ReferenceCurriculum)
    if program_id:
        query = query.filter(ReferenceCurriculum.program_id == program_id)
    result = []
    for ref in query.all():
        prog = db.query(Program).filter(Program.id == ref.program_id).first()
        result.append({
            "id": ref.id,
            "program_id": ref.program_id,
            "program_name": prog.name if prog else "—",
            "branch": prog.branch if prog else "—",
            "academic_year": ref.academic_year,
            "version": ref.version,
            "status": ref.status,
            "description": ref.description,
            "created_by": ref.created_by,
            "courses_count": db.query(Course).filter(Course.reference_curriculum_id == ref.id).count()
        })
    return result

@router.get("/reference/{ref_id}")
def get_reference_curriculum(ref_id: int, db: Session = Depends(get_db)):
    ref = db.query(ReferenceCurriculum).filter(ReferenceCurriculum.id == ref_id).first()
    if not ref:
        raise HTTPException(status_code=404, detail="Reference curriculum not found")
    
    courses = db.query(Course).filter(Course.reference_curriculum_id == ref.id).all()
    course_list = []
    for c in courses:
        units = db.query(Unit).filter(Unit.course_id == c.id).all()
        course_list.append({
            "id": c.id,
            "semester": c.semester,
            "code": c.code,
            "title": c.title,
            "course_type": c.course_type,
            "credits": c.credits,
            "lecture_hours": c.lecture_hours,
            "tutorial_hours": c.tutorial_hours,
            "practical_hours": c.practical_hours,
            "prerequisites": c.prerequisites,
            "objectives": c.objectives,
            "taxonomy_tags": c.taxonomy_tags,
            "units": [{"unit_number": u.unit_number, "title": u.title, "hours": u.hours, "topics": u.topics} for u in units]
        })

    prog = db.query(Program).filter(Program.id == ref.program_id).first()
    return {
        "id": ref.id,
        "program_id": ref.program_id,
        "program_name": prog.name if prog else "—",
        "branch": prog.branch if prog else "—",
        "academic_year": ref.academic_year,
        "version": ref.version,
        "status": ref.status,
        "description": ref.description,
        "created_by": ref.created_by,
        "courses": course_list
    }

@router.post("/reference", status_code=status.HTTP_201_CREATED)
def create_reference_curriculum(data: ReferenceCurriculumCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["super_admin"]))):
    ref = ReferenceCurriculum(
        program_id=data.program_id,
        academic_year=data.academic_year,
        version=data.version,
        description=data.description,
        status="PUBLISHED",
        created_by=f"AICTE ({current_user.full_name})"
    )
    db.add(ref)
    db.commit()
    db.refresh(ref)

    for c in data.courses or []:
        course = Course(
            curriculum_type="REFERENCE",
            reference_curriculum_id=ref.id,
            semester=c.semester,
            code=c.code,
            title=c.title,
            course_type=c.course_type,
            credits=c.credits,
            lecture_hours=c.lecture_hours,
            tutorial_hours=c.tutorial_hours,
            practical_hours=c.practical_hours,
            prerequisites=c.prerequisites,
            objectives=c.objectives,
            taxonomy_tags=c.taxonomy_tags
        )
        db.add(course)
        db.commit()

        for u in c.units or []:
            unit = Unit(
                course_id=course.id,
                unit_number=u.unit_number,
                title=u.title,
                hours=u.hours,
                topics=u.topics
            )
            db.add(unit)
        db.commit()

    log_action(db, current_user.id, current_user.email, current_user.role, "CREATE_REFERENCE_CURRICULUM", "REFERENCE_CURRICULUM", ref.id, f"Created reference curriculum version {ref.version}")
    return ref

@router.get("/university")
def list_university_curricula(university_id: Optional[int] = None, status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(UniversityCurriculum)
    if university_id:
        query = query.filter(UniversityCurriculum.university_id == university_id)
    if status_filter:
        query = query.filter(UniversityCurriculum.status == status_filter)
    
    result = []
    for uc in query.all():
        uni = db.query(University).filter(University.id == uc.university_id).first()
        prog = db.query(Program).filter(Program.id == uc.program_id).first()
        result.append({
            "id": uc.id,
            "university_id": uc.university_id,
            "university_name": uni.name if uni else "—",
            "state": uni.state if uni else "—",
            "program_id": uc.program_id,
            "program_name": prog.name if prog else "—",
            "branch": prog.branch if prog else "—",
            "academic_year": uc.academic_year,
            "version": uc.version,
            "status": uc.status,
            "alignment_score": uc.alignment_score,
            "submitted_at": uc.submitted_at.isoformat() if uc.submitted_at else None,
            "updated_at": uc.updated_at.isoformat() if uc.updated_at else None,
        })
    return result

@router.get("/university/{uc_id}")
def get_university_curriculum(uc_id: int, db: Session = Depends(get_db)):
    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == uc_id).first()
    if not uc:
        raise HTTPException(status_code=404, detail="University curriculum not found")
    
    uni = db.query(University).filter(University.id == uc.university_id).first()
    prog = db.query(Program).filter(Program.id == uc.program_id).first()
    courses = db.query(Course).filter(Course.university_curriculum_id == uc.id).all()
    
    course_list = []
    for c in courses:
        units = db.query(Unit).filter(Unit.course_id == c.id).all()
        course_list.append({
            "id": c.id,
            "semester": c.semester,
            "code": c.code,
            "title": c.title,
            "course_type": c.course_type,
            "credits": c.credits,
            "lecture_hours": c.lecture_hours,
            "tutorial_hours": c.tutorial_hours,
            "practical_hours": c.practical_hours,
            "taxonomy_tags": c.taxonomy_tags,
            "units": [{"unit_number": u.unit_number, "title": u.title, "hours": u.hours, "topics": u.topics} for u in units]
        })

    return {
        "id": uc.id,
        "university_id": uc.university_id,
        "university_name": uni.name if uni else "—",
        "state": uni.state if uni else "—",
        "program_id": uc.program_id,
        "program_name": prog.name if prog else "—",
        "branch": prog.branch if prog else "—",
        "reference_curriculum_id": uc.reference_curriculum_id,
        "academic_year": uc.academic_year,
        "version": uc.version,
        "status": uc.status,
        "alignment_score": uc.alignment_score,
        "courses": course_list
    }

@router.post("/university", status_code=status.HTTP_201_CREATED)
def create_university_curriculum(data: UniversityCurriculumCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["university_admin", "faculty", "super_admin"]))):
    uc = UniversityCurriculum(
        university_id=data.university_id,
        program_id=data.program_id,
        reference_curriculum_id=data.reference_curriculum_id,
        academic_year=data.academic_year,
        version=data.version,
        status="DRAFT",
        alignment_score=0.0
    )
    db.add(uc)
    db.commit()
    db.refresh(uc)
    log_action(db, current_user.id, current_user.email, current_user.role, "CREATE_CURRICULUM_DRAFT", "UNIVERSITY_CURRICULUM", uc.id, f"Created draft curriculum v{uc.version}")
    return uc

@router.post("/university/{uc_id}/submit")
def submit_university_curriculum(uc_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["university_admin", "faculty"]))):
    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == uc_id).first()
    if not uc:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    
    uc.status = "UNDER_REVIEW"
    uc.submitted_at = db.func.now()
    db.commit()
    log_action(db, current_user.id, current_user.email, current_user.role, "SUBMIT_CURRICULUM", "UNIVERSITY_CURRICULUM", uc.id, "Submitted curriculum for AICTE review")
    return {"message": "Curriculum successfully submitted for AICTE Review", "status": uc.status}

@router.post("/university/{uc_id}/publish")
def publish_university_curriculum(uc_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["super_admin"]))):
    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == uc_id).first()
    if not uc:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    
    uc.status = "PUBLISHED"
    uc.approved_at = db.func.now()
    db.commit()
    log_action(db, current_user.id, current_user.email, current_user.role, "PUBLISH_CURRICULUM", "UNIVERSITY_CURRICULUM", uc.id, "Officially published standard curriculum")
    return {"message": "Curriculum officially published on National Portal", "status": uc.status}
