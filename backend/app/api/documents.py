import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Document, ProcessingJob, UniversityCurriculum, Course, Unit, CourseOutcome, User
from app.services.auth_service import require_role, get_current_user
from app.services.document_service import save_uploaded_file, extract_text_and_pages
from app.services.extraction_service import parse_curriculum_structure
from app.services.audit_service import log_action
from app.config import settings

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
async def upload_curriculum_document(
    university_curriculum_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["university_admin", "faculty", "super_admin"]))
):
    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == university_curriculum_id).first()
    if not uc:
        raise HTTPException(status_code=404, detail="Target University Curriculum record not found.")

    # 1. Validation & Save
    file_path, file_filename, file_size = await save_uploaded_file(file)
    ext = os.path.splitext(file.filename)[1].replace(".", "").lower()

    # 2. Database Record
    doc = Document(
        university_curriculum_id=university_curriculum_id,
        filename=file.filename,
        file_path=file_path,
        file_type=ext,
        file_size=file_size,
        status="PROCESSING"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # 3. Create initial Processing Job
    job = ProcessingJob(
        document_id=doc.id,
        status="PROCESSING",
        current_step="Text Extraction",
        total_steps=5,
        progress_pct=25.0,
        message="Extracting document text and tables...",
        extracted_text="",
        extracted_structure={}
    )
    db.add(job)
    db.commit()

    # 4. Pipeline Execution
    try:
        raw_text, pages_data, tables_data, is_scanned = extract_text_and_pages(file_path)
        
        job.progress_pct = 50.0
        job.current_step = "Curriculum Structuring"
        job.message = "Detecting course schemes, units, topics, and course outcomes..."
        db.commit()

        extracted = parse_curriculum_structure(raw_text, pages_data)

        # Store extracted courses in DB
        db.query(Course).filter(Course.university_curriculum_id == uc.id).delete()
        db.commit()

        for c in extracted["courses"]:
            course = Course(
                curriculum_type="UNIVERSITY",
                university_curriculum_id=uc.id,
                semester=c.get("semester", 1),
                code=c.get("code", "CS100"),
                title=c.get("title", "Course"),
                course_type=c.get("course_type", "CORE"),
                credits=c.get("credits", 4.0),
                lecture_hours=c.get("lecture_hours", 3),
                tutorial_hours=c.get("tutorial_hours", 1),
                practical_hours=c.get("practical_hours", 2),
                taxonomy_tags="Extracted"
            )
            db.add(course)
            db.commit()

            for u in c.get("units", []):
                unit = Unit(
                    course_id=course.id,
                    unit_number=u.get("unit_number", 1),
                    title=u.get("title", "Unit"),
                    hours=u.get("hours", 8),
                    topics=u.get("topics", "")
                )
                db.add(unit)
            
            for co in c.get("outcomes", []):
                co_obj = CourseOutcome(
                    course_id=course.id,
                    co_code=co.get("co_code", "CO1"),
                    description=co.get("description", "Course outcome statement"),
                    po_mappings={"PO1": 3, "PO2": 2}
                )
                db.add(co_obj)

            db.commit()

        job.status = "COMPLETED"
        job.current_step = "Completed"
        job.progress_pct = 100.0
        job.message = f"Extracted {len(extracted['courses'])} courses, {extracted['total_topics']} topics, {extracted['total_cos']} COs across {len(pages_data)} pages."
        job.extracted_text = raw_text[:3000]
        job.extracted_structure = extracted
        
        doc.status = "EXTRACTED"
        uc.status = "UPLOADED"
        db.commit()

        log_action(db, current_user.id, current_user.email, current_user.role, "UPLOAD_DOCUMENT", "DOCUMENT", doc.id, f"Uploaded document {file.filename} and extracted {len(extracted['courses'])} courses.")

        return {
            "document_id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "status": doc.status,
            "extracted_courses": len(extracted["courses"]),
            "extracted_topics": extracted["total_topics"],
            "extracted_cos": extracted["total_cos"],
            "pages_processed": len(pages_data),
            "confidence": extracted["overall_confidence"],
            "confidence_label": extracted["confidence_label"],
            "is_scanned": is_scanned
        }

    except Exception as e:
        doc.status = "FAILED"
        job.status = "FAILED"
        job.current_step = "Failed"
        job.error_log = str(e)
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"Document parsing error: {str(e)}"
        )

@router.get("/{doc_id}/status")
def get_document_status(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    job = db.query(ProcessingJob).filter(ProcessingJob.document_id == doc.id).first()
    
    steps = [
        {"name": "Upload & Save File", "status": "completed"},
        {"name": "File Validation", "status": "completed"},
        {"name": "Text & Table Extraction", "status": "completed" if job and job.progress_pct >= 50 else ("processing" if doc.status == "PROCESSING" else "pending")},
        {"name": "Curriculum Structuring", "status": "completed" if job and job.progress_pct >= 75 else ("processing" if job and job.progress_pct >= 50 else "pending")},
        {"name": "AI Embedding & Review", "status": "completed" if doc.status == "EXTRACTED" else "pending"}
    ]

    return {
        "document_id": doc.id,
        "filename": doc.filename,
        "status": doc.status,
        "progress": job.progress_pct if job else 0.0,
        "current_step": job.current_step if job else "Queued",
        "message": job.message if job else "",
        "steps": steps
    }

@router.get("/{doc_id}/extracted")
def get_extracted_curriculum(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    job = db.query(ProcessingJob).filter(ProcessingJob.document_id == doc.id).first()
    return {
        "document_id": doc.id,
        "filename": doc.filename,
        "status": doc.status,
        "extracted_text_preview": job.extracted_text if job else "",
        "extracted_structure": job.extracted_structure if job else {}
    }

@router.put("/{doc_id}/extracted")
def update_extracted_curriculum(
    doc_id: int,
    updated_structure: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["university_admin", "faculty", "super_admin"]))
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    job = db.query(ProcessingJob).filter(ProcessingJob.document_id == doc.id).first()
    if job:
        job.extracted_structure = updated_structure
        db.commit()

    log_action(db, current_user.id, current_user.email, current_user.role, "EDIT_EXTRACTION", "DOCUMENT", doc.id, f"User edited extracted curriculum structure for {doc.filename}.")
    return {"status": "SUCCESS", "message": "Extracted curriculum structure updated in database."}

@router.post("/{doc_id}/confirm")
def confirm_extraction(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["university_admin", "faculty", "super_admin"]))
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.status = "CONFIRMED"
    doc.curriculum.status = "CONFIRMED"
    db.commit()

    log_action(db, current_user.id, current_user.email, current_user.role, "CONFIRM_EXTRACTION", "DOCUMENT", doc.id, f"User confirmed extraction results for {doc.filename}.")
    return {"status": "SUCCESS", "message": "Curriculum extraction confirmed and locked for AI comparison."}
