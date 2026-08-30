import sys
import os
import io

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from app.main import app
from app.db.database import SessionLocal
from app.db.models import User, Document, ProcessingJob, Course, Unit, CourseOutcome, Comparison, ComparisonItem
from app.services.auth_service import create_access_token

client = TestClient(app)

def run_tests():
    print("==================================================")
    print("AICTE CISP INTEGRATION TEST: AUTHENTICATION & REAL UPLOAD")
    print("==================================================\n")

    # 1. Test Auth Login API
    print("--- STEP 1: Testing Login & JWT Token Generation ---")
    login_resp = client.post(
        "/api/auth/login",
        data={"username": "admin@iitb.ac.in", "password": "uni123"}
    )
    print(f"Login Status Code: {login_resp.status_code}")
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token_data = login_resp.json()
    jwt_token = token_data["access_token"]
    print(f"Token Type: {token_data['token_type']}")
    print(f"User Email: {token_data['user']['email']}, Role: {token_data['user']['role']}")
    assert jwt_token is not None and len(jwt_token) > 10, "JWT token missing"

    # 2. Test Protected /auth/me
    print("\n--- STEP 2: Testing /auth/me with Bearer Token ---")
    me_resp = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {jwt_token}"}
    )
    print(f"Me Endpoint Status Code: {me_resp.status_code}")
    assert me_resp.status_code == 200, f"Get me failed: {me_resp.text}"
    print(f"Authenticated User: {me_resp.json()}")

    # 3. Test RBAC: Public User Forbidden (403)
    print("\n--- STEP 3: Testing Role-Based Access Control (RBAC) ---")
    public_token = create_access_token(data={"sub": "public@aicte.gov.in", "role": "public"})
    fake_pdf = io.BytesIO(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT\n/F1 12 Tf\n72 712 Td\n(PCC-CS301 Data Structures and Algorithms) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000200 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n300\n%%EOF")
    
    pub_upload = client.post(
        "/api/documents/upload",
        data={"university_curriculum_id": 1},
        files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        headers={"Authorization": f"Bearer {public_token}"}
    )
    print(f"Public Upload Status Code: {pub_upload.status_code}")
    print(f"Public Upload Response: {pub_upload.json()}")
    assert pub_upload.status_code == 403, "Public users should be denied upload access (403)"

    # 4. Test Real PDF Upload with Valid JWT Token
    print("\n--- STEP 4: Testing Real PDF Upload with Valid JWT Token ---")
    # Check if a real PDF exists in storage or create a multi-page syllabus PDF
    real_pdf_path = os.path.join(os.path.dirname(__file__), "..", "storage", "uploads", "bcfe61d0_Updated-AICTE_-_UG_CSE.pdf")
    
    if os.path.exists(real_pdf_path):
        print(f"Found existing real university syllabus PDF at: {real_pdf_path}")
        with open(real_pdf_path, "rb") as f:
            pdf_bytes = f.read()
        filename = "Updated-AICTE_-_UG_CSE.pdf"
    else:
        print("Using test syllabus PDF file...")
        pdf_content = (
            "%PDF-1.4\n"
            "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
            "3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n"
            "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
            "5 0 obj << /Length 350 >> stream\n"
            "BT\n/F1 12 Tf\n72 712 Td\n"
            "(Stanley College of Engineering and Technology) Tj 0 -20 Td\n"
            "(Department of Computer Science & Engineering) Tj 0 -20 Td\n"
            "(Semester III Syllabi 2027-28) Tj 0 -30 Td\n"
            "(Course Code: PCC-CS301 Title: Data Structures & Algorithms Credits: 4.0 LTP: 3-1-2) Tj 0 -20 Td\n"
            "(Unit 1: Linear Structures - Arrays Stacks Queues Linked Lists) Tj 0 -20 Td\n"
            "(CO1: Analyze complexity of linear data structures) Tj 0 -30 Td\n"
            "(Course Code: PCC-CS402 Title: Database Management Systems Credits: 4.0 LTP: 3-0-2) Tj 0 -20 Td\n"
            "(Unit 1: Relational Data Model SQL Normalization 1NF BCNF) Tj 0 -20 Td\n"
            "(CO1: Design normalized database schemas and SQL queries) Tj 0 -30 Td\n"
            "(Course Code: PCC-CS501 Title: Artificial Intelligence & Machine Learning Credits: 4.0 LTP: 3-1-2) Tj 0 -20 Td\n"
            "(Unit 1: Supervised Learning Regression Decision Trees Neural Networks) Tj 0 -20 Td\n"
            "(CO1: Implement machine learning models in Python) Tj\n"
            "ET\nstream\nendobj\n"
            "xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000227 00000 n \n0000000300 00000 n \n"
            "trailer << /Size 6 /Root 1 0 R >>\nstartxref\n700\n%%EOF\n"
        ).encode('utf-8')
        pdf_bytes = pdf_content
        filename = "stanley_CSE_Syllabus.pdf"

    upload_resp = client.post(
        "/api/documents/upload",
        data={"university_curriculum_id": 1},
        files={"file": (filename, pdf_bytes, "application/pdf")},
        headers={"Authorization": f"Bearer {jwt_token}"}
    )
    
    print(f"Upload API Status Code: {upload_resp.status_code}")
    print(f"Upload Response JSON: {upload_resp.json()}")
    assert upload_resp.status_code == 200, f"Upload failed: {upload_resp.text}"

    res = upload_resp.json()

    # 5. Output Verification Summary Table
    print("\n==================================================")
    print("VERIFICATION RESULTS SUMMARY")
    print("==================================================")
    print(f"1. Document ID: {res['document_id']}")
    print(f"2. Filename: {res['filename']}")
    print(f"3. File Type: .{res['file_type']}")
    print(f"4. Status: {res['status']}")
    print(f"5. Pages Processed: {res['pages_processed']}")
    print(f"6. Extracted Courses: {res['extracted_courses']}")
    print(f"7. Extracted Topics: {res['extracted_topics']}")
    print(f"8. Extracted COs: {res['extracted_cos']}")
    print(f"9. Extraction Confidence: {res['confidence']}% ({res['confidence_label']})")
    print(f"10. Dynamic CISP Alignment Score: {res.get('alignment_score')}%")

    if res.get('comparison_summary'):
        cs = res['comparison_summary']
        print(f"    - Subject Match Score: {cs.get('subject_score')}%")
        print(f"    - Topic Coverage Score: {cs.get('topic_score')}%")
        print(f"    - Credit Score: {cs.get('credit_score')}%")
        print(f"    - Practical Score: {cs.get('practical_score')}%")
        print(f"    - CO Score: {cs.get('co_score')}%")
        print(f"    - Emerging Tech Score: {cs.get('emerging_tech_score')}%")
        print(f"    - ML Embedding Engine: {cs.get('embedding_engine')}")
        print(f"    - Items Evaluated: {len(cs.get('items', []))}")

    # 6. Database Persistence Verification
    db = SessionLocal()
    db_doc = db.query(Document).filter(Document.id == res['document_id']).first()
    db_job = db.query(ProcessingJob).filter(ProcessingJob.document_id == res['document_id']).first()
    db_comp = db.query(Comparison).filter(Comparison.university_curriculum_id == 1).first()
    db_items = db.query(ComparisonItem).filter(ComparisonItem.comparison_id == db_comp.id).all() if db_comp else []
    
    print("\n--- DATABASE PERSISTENCE VERIFICATION ---")
    print(f"Document Record in DB: Found (ID: {db_doc.id}, Status: {db_doc.status})")
    print(f"ProcessingJob Record in DB: Found (Status: {db_job.status}, Step: {db_job.current_step})")
    print(f"Comparison Record in DB: Found (Overall Score: {db_comp.overall_score}%)" if db_comp else "Comparison not found")
    print(f"Comparison Items Saved: {len(db_items)}")

    assert db_doc is not None, "Document not saved in DB"
    assert db_doc.status == "EXTRACTED", "Document status should be EXTRACTED"
    assert db_comp is not None, "Comparison not saved in DB"

    db.close()
    print("\n[SUCCESS] ALL INTEGRATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
