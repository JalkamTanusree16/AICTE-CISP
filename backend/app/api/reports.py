from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Comparison, ComparisonItem, UniversityCurriculum, University, Program
from app.services.report_service import generate_pdf_report, generate_excel_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/pdf/{uc_id}")
def export_pdf_report(uc_id: int, db: Session = Depends(get_db)):
    comp = db.query(Comparison).filter(Comparison.university_curriculum_id == uc_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Comparison analysis record not found in database for this curriculum.")

    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == uc_id).first()
    uni_name = uc.university.name if uc and uc.university else "Indian Institute of Technology Bombay"
    prog_name = uc.program.name if uc and uc.program else "B.Tech Computer Science & Engineering"

    items = db.query(ComparisonItem).filter(ComparisonItem.comparison_id == comp.id).all()
    comp_data = {
        "overall_score": comp.overall_score,
        "subject_score": comp.subject_score,
        "topic_score": comp.topic_score,
        "credit_score": comp.credit_score,
        "practical_score": comp.practical_score,
        "co_score": comp.co_score,
        "emerging_tech_score": comp.emerging_tech_score,
        "embedding_engine": "SentenceTransformer (all-MiniLM-L6-v2)" if comp.analysis_json and "SentenceTransformer" in str(comp.analysis_json) else "TF-IDF + Cosine Similarity Engine",
        "items": [
            {
                "ref_course_title": i.ref_course_title,
                "uni_course_title": i.uni_course_title,
                "similarity_score": i.similarity_score,
                "status": i.status,
                "evidence_location": i.evidence_location,
                "gap_description": i.gap_description,
                "recommendation": i.recommendation
            } for i in items
        ]
    }

    filename = f"AICTE_CISP_Standardization_Report_UC{uc_id}.pdf"
    filepath = generate_pdf_report(comp_data, university_name=uni_name, program_name=prog_name, filename=filename)
    return FileResponse(filepath, media_type="application/pdf", filename=filename)

@router.get("/excel/{uc_id}")
def export_excel_report(uc_id: int, db: Session = Depends(get_db)):
    comp = db.query(Comparison).filter(Comparison.university_curriculum_id == uc_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Comparison analysis record not found in database for this curriculum.")

    uc = db.query(UniversityCurriculum).filter(UniversityCurriculum.id == uc_id).first()
    uni_name = uc.university.name if uc and uc.university else "Indian Institute of Technology Bombay"
    prog_name = uc.program.name if uc and uc.program else "B.Tech Computer Science & Engineering"

    items = db.query(ComparisonItem).filter(ComparisonItem.comparison_id == comp.id).all()
    comp_data = {
        "overall_score": comp.overall_score,
        "subject_score": comp.subject_score,
        "topic_score": comp.topic_score,
        "credit_score": comp.credit_score,
        "practical_score": comp.practical_score,
        "co_score": comp.co_score,
        "emerging_tech_score": comp.emerging_tech_score,
        "embedding_engine": "SentenceTransformer (all-MiniLM-L6-v2)" if comp.analysis_json and "SentenceTransformer" in str(comp.analysis_json) else "TF-IDF + Cosine Similarity Engine",
        "items": [
            {
                "Reference Course": i.ref_course_title,
                "University Course": i.uni_course_title,
                "Similarity Score": i.similarity_score,
                "Match Status": i.status,
                "Evidence Location": i.evidence_location,
                "Gap Description": i.gap_description,
                "AI Recommendation": i.recommendation
            } for i in items
        ]
    }

    filename = f"AICTE_CISP_Standardization_Matrix_UC{uc_id}.xlsx"
    filepath = generate_excel_report(comp_data, university_name=uni_name, program_name=prog_name, filename=filename)
    return FileResponse(filepath, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=filename)
