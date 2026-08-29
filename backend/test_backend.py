import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

import app.services.embedding_service as m
from app.services.embedding_service import embedding_service, get_embedding_engine_info, compute_similarity
from app.services.scoring_service import calculate_overall_alignment
from app.services.comparison_service import run_semantic_comparison
from app.services.report_service import generate_pdf_report, generate_excel_report
from app.config import settings

def test_full_backend():
    print("--- 1. Testing embedding_service Existence & Engine ---")
    service_exists = hasattr(m, 'embedding_service')
    print(f"File: {m.__file__}")
    print(f"Service exists: {service_exists}")
    assert service_exists, "embedding_service object must exist in embedding_service.py"

    engine_info = embedding_service.get_embedding_engine_info()
    print(f"Engine Info: {engine_info}")

    print("\n--- 2. Testing Required Course Similarity Pairs ---")
    test_pairs = [
        ("Data Structures and Algorithms", "Data Structures"),
        ("Database Management Systems", "Database Systems"),
        ("Machine Learning", "Artificial Intelligence and Machine Learning"),
        ("Computer Networks", "Computer Networks"),
        ("Operating Systems", "Operating System")
    ]

    for t1, t2 in test_pairs:
        sim = embedding_service.similarity(t1, t2)
        status_label = "Matched" if sim >= 0.80 else ("Partial Match" if sim >= 0.50 else "Missing")
        print(f"[{status_label}] '{t1}' vs '{t2}' -> Similarity Score: {sim}")
        assert sim > 0.4, f"Similarity for '{t1}' vs '{t2}' should be valid"

    print("\n--- 3. Testing Encode & Batch Similarity ---")
    vector = embedding_service.encode("Computer Networks")
    print(f"Encode output shape/dimension: {vector.shape}")
    
    batch_res = embedding_service.batch_similarity(["Operating Systems"], ["Operating System", "Computer Networks"])
    print(f"Batch Similarity Matrix: {batch_res}")

    print("\n--- 4. Testing Scoring Formula ---")
    score = calculate_overall_alignment(90.0, 85.0, 90.0, 80.0, 85.0, 75.0)
    print(f"Calculated Overall Score: {score}%")
    assert 80.0 <= score <= 90.0, "Score calculation error"

    print("\n--- 5. Testing Full Semantic Comparison Engine ---")
    ref_courses = [
        {"code": "CS201", "title": "Data Structures & Algorithms", "credits": 4.0, "practical_hours": 2, "units": [{"topics": "Arrays, Trees, Graphs"}]},
        {"code": "CS301", "title": "Database Systems", "credits": 4.0, "practical_hours": 2, "units": [{"topics": "SQL, ER Model, Relational Algebra"}]}
    ]
    uni_courses = [
        {"code": "PCC-CS301", "title": "Data Structures", "credits": 4.0, "practical_hours": 2, "source_page": 1, "units": [{"topics": "Arrays, Linked Lists, Stacks, Binary Trees"}]},
        {"code": "PCC-CS402", "title": "Database Management Systems", "credits": 4.0, "practical_hours": 2, "source_page": 2, "units": [{"topics": "Relational Data Model, SQL Queries, Normalization"}]}
    ]
    
    res = run_semantic_comparison(ref_courses, uni_courses)
    print(f"Overall Score: {res['overall_score']}%")
    print(f"Subject Score: {res['subject_score']}% | Topic Score: {res['topic_score']}%")
    print(f"Items Evaluated: {len(res['items'])}")

    print("\n--- 6. Testing PDF & Excel Report Generation ---")
    pdf_path = generate_pdf_report(res, university_name="IIT Bombay Test", filename="test_report.pdf")
    print(f"Generated PDF Report at: {pdf_path}")
    assert os.path.exists(pdf_path), "PDF file was not created"

    excel_path = generate_excel_report(res, university_name="IIT Bombay Test", filename="test_report.xlsx")
    print(f"Generated Excel Report at: {excel_path}")
    assert os.path.exists(excel_path), "Excel file was not created"

    print("\n[SUCCESS] All backend embedding_service unit tests PASSED successfully!")

if __name__ == "__main__":
    test_full_backend()
