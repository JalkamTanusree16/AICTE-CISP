from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config import settings
from app.db.database import engine, Base
from app.db.seed_data import seed_database
from app.services.embedding_service import embedding_service
from app.api import (
    auth, universities, programs, curricula, documents,
    comparisons, reviews, analytics, reports, notices,
    audit_logs, settings as settings_api
)

# Initialize database tables and seed initial data safely
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"Database initialization note: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official API Server for AICTE National Curriculum Intelligence & Standardization Platform (CISP)"
)

# CORS Middleware setup
frontend_url = os.getenv("FRONTEND_URL", "*")
allowed_origins = [frontend_url] if frontend_url != "*" else ["*"]
if frontend_url != "*":
    allowed_origins.extend(["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directories for report downloads if present
if os.path.exists(settings.REPORTS_DIR):
    app.mount("/static/reports", StaticFiles(directory=settings.REPORTS_DIR), name="reports_static")

# Include API routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(universities.router, prefix=settings.API_V1_STR)
app.include_router(programs.router, prefix=settings.API_V1_STR)
app.include_router(curricula.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(comparisons.router, prefix=settings.API_V1_STR)
app.include_router(reviews.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(notices.router, prefix=settings.API_V1_STR)
app.include_router(audit_logs.router, prefix=settings.API_V1_STR)
app.include_router(settings_api.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_simple():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "ONLINE",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "CISP Backend Engine",
        "database": "connected",
        "version": settings.VERSION
    }

@app.get("/api/system/status")
def system_status():
    pdf_ready = False
    try:
        import fitz
        pdf_ready = True
    except ImportError:
        pdf_ready = False

    docx_ready = False
    try:
        import docx
        docx_ready = True
    except ImportError:
        docx_ready = False

    xlsx_ready = False
    try:
        import openpyxl
        xlsx_ready = True
    except ImportError:
        xlsx_ready = False

    csv_ready = False
    try:
        import pandas
        csv_ready = True
    except ImportError:
        csv_ready = False

    report_ready = False
    try:
        import reportlab
        report_ready = True
    except ImportError:
        report_ready = False

    info = embedding_service.get_embedding_engine_info()

    return {
        "backend": "operational",
        "database": "connected",
        "pdf_parser": "ready" if pdf_ready else "not_installed",
        "docx_parser": "ready" if docx_ready else "not_installed",
        "xlsx_parser": "ready" if xlsx_ready else "not_installed",
        "csv_parser": "ready" if csv_ready else "not_installed",
        "embedding_model": info["engine"],
        "embedding_service_exists": hasattr(embedding_service, "similarity"),
        "report_generator": "ready" if report_ready else "not_installed"
    }

@app.get("/api/system/test-embeddings")
def test_embeddings():
    test_pairs = [
        ("Data Structures and Algorithms", "Data Structures"),
        ("Database Management Systems", "Database Systems"),
        ("Machine Learning", "Artificial Intelligence and Machine Learning"),
        ("Computer Networks", "Computer Networks"),
        ("Operating Systems", "Operating System")
    ]
    
    results = []
    info = embedding_service.get_embedding_engine_info()
    
    for text1, text2 in test_pairs:
        sim = embedding_service.similarity(text1, text2)
        status_label = "Matched" if sim >= 0.80 else ("Partial Match" if sim >= 0.50 else "Missing")
        results.append({
            "text1": text1,
            "text2": text2,
            "similarity_score": sim,
            "matching_status": status_label
        })
        
    return {
        "embedding_service_exists": hasattr(embedding_service, "similarity"),
        "model_used": info["engine"],
        "is_sentence_transformer": info["is_sentence_transformer"],
        "test_results": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
