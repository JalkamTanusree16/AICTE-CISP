import json
from datetime import datetime
from app.services.auth_service import get_password_hash
from app.db.database import SessionLocal, Base, engine
from app.db.models import (
    User, University, Program, ReferenceCurriculum, UniversityCurriculum,
    Course, Unit, CourseOutcome, Document, ProcessingJob, Comparison,
    ComparisonItem, Review, Comment, AuditLog, Notice, Setting, EmergingTechnology
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(University).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with realistic GOI AICTE demonstration data...")

    # 1. Emerging Technologies
    techs = [
        EmergingTechnology(name="Generative AI & LLMs", category="AI", description="Transformer models, RAG architectures, prompt engineering, and fine-tuning.", key_topics="Transformers, Attention Mechanism, RAG, Prompt Engineering, Model Fine-tuning", is_active=True),
        EmergingTechnology(name="Cloud Security & DevSecOps", category="Security", description="Zero-trust security models, CI/CD pipeline security, cloud compliance.", key_topics="Zero Trust, CI/CD Security, Container Security, IAM, Cloud Compliance", is_active=True),
        EmergingTechnology(name="Edge AI & IoT Systems", category="Systems", description="Deploying machine learning models on microcontrollers and edge hardware.", key_topics="TinyML, Edge Computing, Embedded AI, MQTT, Sensor Integration", is_active=True),
        EmergingTechnology(name="Quantum Computing Fundamentals", category="Systems", description="Qubits, quantum circuits, Qiskit framework, and quantum algorithms.", key_topics="Qubits, Quantum Gates, Qiskit, Shor's Algorithm, Quantum Cryptography", is_active=True),
        EmergingTechnology(name="MLOps & AI Governance", category="Data", description="Model monitoring, data drift, feature stores, and ethical AI compliance.", key_topics="Model Drift, Feature Store, MLflow, Explainable AI, Ethics", is_active=True),
    ]
    db.add_all(techs)

    # 2. Universities (10 Demonstration Institutions)
    unis = [
        University(code="UNI-IITB", name="Indian Institute of Technology Bombay", state="Maharashtra", type="Central", address="Powai, Mumbai, Maharashtra 400076", website="https://www.iitb.ac.in", status="APPROVED"),
        University(code="UNI-ANNA", name="Anna University", state="Tamil Nadu", type="State", address="Guindy, Chennai, Tamil Nadu 600025", website="https://www.annauniv.edu", status="APPROVED"),
        University(code="UNI-VTU", name="Visvesvaraya Technological University", state="Karnataka", type="State", address="Belagavi, Karnataka 590018", website="https://vtu.ac.in", status="APPROVED"),
        University(code="UNI-JNTUH", name="JNTU Hyderabad", state="Telangana", type="State", address="Kukatpally, Hyderabad, Telangana 500085", website="https://jntuh.ac.in", status="APPROVED"),
        University(code="UNI-NITT", name="National Institute of Technology Trichy", state="Tamil Nadu", type="Central", address="Tiruchirappalli, Tamil Nadu 620015", website="https://www.nitt.edu", status="APPROVED"),
        University(code="UNI-BITS", name="BITS Pilani", state="Rajasthan", type="Deemed", address="Pilani, Rajasthan 333031", website="https://www.bits-pilani.ac.in", status="APPROVED"),
        University(code="UNI-DTU", name="Delhi Technological University", state="Delhi", type="State", address="Bawana Road, Delhi 110042", website="http://dtu.ac.in", status="APPROVED"),
        University(code="UNI-SPPU", name="Savitribai Phule Pune University", state="Maharashtra", type="State", address="Ganeshkhind, Pune, Maharashtra 411007", website="http://www.unipune.ac.in", status="APPROVED"),
        University(code="UNI-GTU", name="Gujarat Technological University", state="Gujarat", type="State", address="Chandkheda, Ahmedabad, Gujarat 382424", website="https://www.gtu.ac.in", status="APPROVED"),
        University(code="UNI-SRM", name="SRM Institute of Science and Technology", state="Tamil Nadu", type="Deemed", address="Kattankulathur, Chengalpattu 603203", website="https://www.srmist.edu.in", status="APPROVED")
    ]
    db.add_all(unis)
    db.commit()

    # 3. Users (5 Roles)
    iitb = db.query(University).filter(University.code == "UNI-IITB").first()
    users = [
        User(email="admin@aicte.gov.in", password_hash=get_password_hash("admin123"), full_name="Dr. K. S. Sharma (AICTE Super Admin)", role="super_admin", university_id=None),
        User(email="reviewer@aicte.gov.in", password_hash=get_password_hash("reviewer123"), full_name="Prof. R. V. Raman (National Review Committee)", role="reviewer", university_id=None),
        User(email="admin@iitb.ac.in", password_hash=get_password_hash("uni123"), full_name="Dr. Arisudan Das (IITB Nodal Officer)", role="university_admin", university_id=iitb.id),
        User(email="faculty@iitb.ac.in", password_hash=get_password_hash("faculty123"), full_name="Dr. Sunita Deshmukh (Curriculum Designer)", role="faculty", university_id=iitb.id),
        User(email="public@aicte.gov.in", password_hash=get_password_hash("public123"), full_name="Public Visitor", role="public", university_id=None),
    ]
    db.add_all(users)

    # 4. Programs
    programs = [
        Program(code="PROG-CSE", name="Computer Science & Engineering", degree_level="B.Tech", branch="Computer Science", duration_years=4, total_credits=160),
        Program(code="PROG-ECE", name="Electronics & Communication Engineering", degree_level="B.Tech", branch="Electronics", duration_years=4, total_credits=160),
        Program(code="PROG-ME", name="Mechanical Engineering", degree_level="B.Tech", branch="Mechanical", duration_years=4, total_credits=160),
        Program(code="PROG-CE", name="Civil Engineering", degree_level="B.Tech", branch="Civil", duration_years=4, total_credits=160),
        Program(code="PROG-AIDS", name="Artificial Intelligence & Data Science", degree_level="B.Tech", branch="AI & Data", duration_years=4, total_credits=160),
        Program(code="PROG-MBA", name="Master of Business Administration", degree_level="MBA", branch="Management", duration_years=2, total_credits=96),
    ]
    db.add_all(programs)
    db.commit()

    cse_prog = db.query(Program).filter(Program.code == "PROG-CSE").first()

    # 5. AICTE Reference Curriculum (Model Curriculum B.Tech CSE 2027-28)
    ref_curr = ReferenceCurriculum(
        program_id=cse_prog.id,
        academic_year="2027-28",
        version="v1.0",
        status="PUBLISHED",
        description="AICTE National Model Curriculum for B.Tech Computer Science & Engineering (Outcome-Based Education Standard 2027–28)",
        created_by="AICTE All-India Board of Computer Science & Engineering Studies"
    )
    db.add(ref_curr)
    db.commit()

    # Reference Courses
    c1 = Course(curriculum_type="REFERENCE", reference_curriculum_id=ref_curr.id, semester=3, code="PCC-CS301", title="Data Structures and Algorithms", course_type="CORE", credits=4.0, lecture_hours=3, tutorial_hours=1, practical_hours=2, taxonomy_tags="Algorithms, Data Structures")
    c2 = Course(curriculum_type="REFERENCE", reference_curriculum_id=ref_curr.id, semester=5, code="PCC-CS501", title="Database Management Systems", course_type="CORE", credits=4.0, lecture_hours=3, tutorial_hours=1, practical_hours=2, taxonomy_tags="Database, SQL, NoSQL")
    c3 = Course(curriculum_type="REFERENCE", reference_curriculum_id=ref_curr.id, semester=6, code="PCC-CS601", title="Artificial Intelligence and Machine Learning", course_type="CORE", credits=4.0, lecture_hours=3, tutorial_hours=0, practical_hours=2, taxonomy_tags="AI, ML, Neural Networks")
    c4 = Course(curriculum_type="REFERENCE", reference_curriculum_id=ref_curr.id, semester=7, code="PEC-CS701", title="Generative AI and Large Language Models", course_type="ELECTIVE", credits=3.0, lecture_hours=3, tutorial_hours=0, practical_hours=0, taxonomy_tags="Generative AI, LLMs, Transformers")
    c5 = Course(curriculum_type="REFERENCE", reference_curriculum_id=ref_curr.id, semester=7, code="PCC-CS702", title="Cloud Security and DevSecOps", course_type="CORE", credits=3.0, lecture_hours=3, tutorial_hours=0, practical_hours=2, taxonomy_tags="Cloud, Security, DevSecOps")
    
    db.add_all([c1, c2, c3, c4, c5])
    db.commit()

    # Units & Topics for Reference Courses
    u1 = Unit(course_id=c1.id, unit_number=1, title="Linear Data Structures", hours=8, topics="Arrays, Stacks, Queues, Linked Lists, Doubly Linked Lists")
    u2 = Unit(course_id=c1.id, unit_number=2, title="Trees and Graph Algorithms", hours=10, topics="Binary Trees, AVL Trees, B-Trees, Graph Traversals BFS/DFS, Dijkstra Algorithm")
    u3 = Unit(course_id=c3.id, unit_number=1, title="Supervised and Unsupervised Learning", hours=8, topics="Linear Regression, Decision Trees, SVM, K-Means Clustering, PCA")
    u4 = Unit(course_id=c3.id, unit_number=2, title="Neural Networks and Deep Learning", hours=10, topics="Perceptron, Backpropagation, CNN Architectures, Recurrent Neural Networks")
    u5 = Unit(course_id=c4.id, unit_number=1, title="Transformer Architecture & Attention Mechanisms", hours=9, topics="Self-attention, Multi-head attention, Encoder-Decoder transformers, BERT, GPT foundation models")
    u6 = Unit(course_id=c4.id, unit_number=2, title="Retrieval Augmented Generation (RAG) & Fine-Tuning", hours=9, topics="Vector Databases, Semantic Search, LangChain, LoRA fine-tuning, Prompt Engineering")
    db.add_all([u1, u2, u3, u4, u5, u6])

    # 6. University Curriculum Submissions (IIT Bombay CSE 2027-28)
    uni_curr = UniversityCurriculum(
        university_id=iitb.id,
        program_id=cse_prog.id,
        reference_curriculum_id=ref_curr.id,
        academic_year="2027-28",
        version="v1.0",
        status="UNDER_REVIEW",
        alignment_score=84.7,
        submitted_at=datetime.utcnow()
    )
    db.add(uni_curr)
    db.commit()

    # IIT Bombay Extracted Courses
    uc1 = Course(curriculum_type="UNIVERSITY", university_curriculum_id=uni_curr.id, semester=3, code="CS213", title="Data Structures and Algorithms", course_type="CORE", credits=4.0, lecture_hours=3, tutorial_hours=1, practical_hours=2, taxonomy_tags="Algorithms, Data Structures")
    uc2 = Course(curriculum_type="UNIVERSITY", university_curriculum_id=uni_curr.id, semester=5, code="CS317", title="Database Systems", course_type="CORE", credits=4.0, lecture_hours=3, tutorial_hours=1, practical_hours=2, taxonomy_tags="Database, SQL")
    uc3 = Course(curriculum_type="UNIVERSITY", university_curriculum_id=uni_curr.id, semester=6, code="CS419", title="Introduction to Machine Learning", course_type="CORE", credits=4.0, lecture_hours=3, tutorial_hours=0, practical_hours=2, taxonomy_tags="AI, ML, Neural Networks")
    uc4 = Course(curriculum_type="UNIVERSITY", university_curriculum_id=uni_curr.id, semester=7, code="CS480", title="Advanced Topics in Neural Networks", course_type="ELECTIVE", credits=3.0, lecture_hours=3, tutorial_hours=0, practical_hours=0, taxonomy_tags="Neural Networks, Deep Learning")
    uc5 = Course(curriculum_type="UNIVERSITY", university_curriculum_id=uni_curr.id, semester=7, code="CS460", title="Cloud Infrastructure & Security", course_type="CORE", credits=3.0, lecture_hours=3, tutorial_hours=0, practical_hours=2, taxonomy_tags="Cloud, Security")
    db.add_all([uc1, uc2, uc3, uc4, uc5])
    db.commit()

    uu1 = Unit(course_id=uc1.id, unit_number=1, title="Linear Structures", hours=8, topics="Arrays, Stacks, Queues, Linked Lists")
    uu2 = Unit(course_id=uc1.id, unit_number=2, title="Hierarchical Structures", hours=10, topics="Binary Trees, AVL Trees, Graph Search Algorithms")
    uu3 = Unit(course_id=uc3.id, unit_number=1, title="Machine Learning Fundamentals", hours=8, topics="Regression Models, Decision Trees, Support Vector Machines, K-Means")
    uu4 = Unit(course_id=uc4.id, unit_number=1, title="Deep Learning Models", hours=9, topics="Convolutional Networks, Recurrent Networks, Attention Mechanisms")
    db.add_all([uu1, uu2, uu3, uu4])

    # Document & Processing Job
    doc = Document(
        university_curriculum_id=uni_curr.id,
        filename="IITB_BTech_CSE_Curriculum_2027_28.pdf",
        file_path="uploads/demo_iitb_cse.pdf",
        file_type="pdf",
        file_size=2458900,
        status="EXTRACTED"
    )
    db.add(doc)
    db.commit()

    job = ProcessingJob(
        document_id=doc.id,
        status="COMPLETED",
        current_step="ANALYSIS_COMPLETE",
        total_steps=7,
        progress_pct=100.0,
        message="Document parsed, structure verified, and semantic comparison completed.",
        extracted_text="IIT Bombay Department of Computer Science & Engineering. Syllabus B.Tech 2027-28...",
        extracted_structure={"total_courses": 5, "semesters": [3, 5, 6, 7]}
    )
    db.add(job)

    # 7. Comparison Record & Items
    comp = Comparison(
        university_curriculum_id=uni_curr.id,
        reference_curriculum_id=ref_curr.id,
        overall_score=84.7,
        subject_score=92.0,
        topic_score=81.0,
        credit_score=88.0,
        practical_score=79.0,
        co_score=85.0,
        emerging_tech_score=73.0,
        analysis_json={"match_summary": "5 subjects evaluated. 3 Matched, 1 Partial Match, 1 Missing Emerging Tech Course."}
    )
    db.add(comp)
    db.commit()

    items = [
        ComparisonItem(
            comparison_id=comp.id,
            ref_course_title="Data Structures and Algorithms",
            ref_topic="Linear & Tree Data Structures",
            uni_course_title="Data Structures and Algorithms",
            uni_topic="Linear Structures & Hierarchical Structures",
            similarity_score=0.96,
            status="Matched",
            match_type="Cosine Similarity (Embeddings)",
            evidence_location="Page 4, Section 3.1",
            gap_description=None,
            recommendation=None
        ),
        ComparisonItem(
            comparison_id=comp.id,
            ref_course_title="Database Management Systems",
            ref_topic="SQL, Normalization & Transaction Processing",
            uni_course_title="Database Systems",
            uni_topic="Relational Model, SQL, Query Processing",
            similarity_score=0.92,
            status="Matched",
            match_type="Cosine Similarity (Embeddings)",
            evidence_location="Page 12, Section 5.2",
            gap_description=None,
            recommendation=None
        ),
        ComparisonItem(
            comparison_id=comp.id,
            ref_course_title="Artificial Intelligence and Machine Learning",
            ref_topic="Neural Networks, CNNs & RNNs",
            uni_course_title="Introduction to Machine Learning",
            uni_topic="Regression, SVM, Neural Networks Basics",
            similarity_score=0.74,
            status="Partial Match",
            match_type="Semantic & Keyword Matching",
            evidence_location="Page 18, Section 6.1",
            gap_description="Core ML algorithms are covered, but advanced deep learning architecture coverage is partial.",
            recommendation="Enhance Unit 2 to include modern CNN architectures and Transformer primitives."
        ),
        ComparisonItem(
            comparison_id=comp.id,
            ref_course_title="Generative AI and Large Language Models",
            ref_topic="Transformers, RAG, Vector DBs, Prompt Engineering",
            uni_course_title="—",
            uni_topic="—",
            similarity_score=0.18,
            status="Missing",
            match_type="Vector Cosine Distance below 0.50 threshold",
            evidence_location="Uploaded document contains no equivalent subject or unit.",
            gap_description="No dedicated unit or course on Generative AI, RAG, or Large Language Models detected.",
            recommendation="Consider introducing Generative AI concepts as a Semester 7 elective course (3 credits)."
        ),
        ComparisonItem(
            comparison_id=comp.id,
            ref_course_title="Cloud Security and DevSecOps",
            ref_topic="Zero-Trust Architecture, CI/CD Pipeline Security",
            uni_course_title="Cloud Infrastructure & Security",
            uni_topic="Cloud Virtualization & Security Basics",
            similarity_score=0.82,
            status="Matched",
            match_type="Cosine Similarity (Embeddings)",
            evidence_location="Page 25, Section 7.2",
            gap_description="DevSecOps automated pipeline security not explicitly mentioned.",
            recommendation="Add a 2-hour lab unit on CI/CD security scanning tools."
        )
    ]
    db.add_all(items)

    # 8. Official Notices
    notices = [
        Notice(title="Revised AICTE Model Curriculum for B.Tech Computer Science & Engineering 2027–28", category="CIRCULAR", publish_date="2026-08-15", link_url="#", is_important=True),
        Notice(title="Mandatory Inclusion of Generative AI & Cyber Security Modules in Technical Programs", category="POLICY", publish_date="2026-08-01", link_url="#", is_important=True),
        Notice(title="National AICTE Standardization Portal (CISP) Rollout Guidelines for Universities", category="GUIDELINE", publish_date="2026-07-20", link_url="#", is_important=False),
    ]
    db.add_all(notices)

    # 9. Audit Logs
    reviewer = db.query(User).filter(User.email == "reviewer@aicte.gov.in").first()
    logs = [
        AuditLog(user_id=reviewer.id, user_email="reviewer@aicte.gov.in", user_role="reviewer", action="REVIEW_STARTED", entity_type="CURRICULUM", entity_id=uni_curr.id, details="Reviewer assigned to inspect IIT Bombay CSE Curriculum submission v1.0."),
        AuditLog(user_id=2, user_email="admin@iitb.ac.in", user_role="university_admin", action="DOCUMENT_UPLOAD", entity_type="DOCUMENT", entity_id=doc.id, details="Uploaded document IITB_BTech_CSE_Curriculum_2027_28.pdf."),
    ]
    db.add_all(logs)

    # 10. System Settings (Dynamic Weights)
    settings_list = [
        Setting(key="weight_subject", value="0.25", description="Weight for Subject alignment in overall score"),
        Setting(key="weight_topic", value="0.25", description="Weight for Topic alignment in overall score"),
        Setting(key="weight_credit", value="0.15", description="Weight for Credit allocation alignment"),
        Setting(key="weight_practical", value="0.15", description="Weight for Practical & Lab component alignment"),
        Setting(key="weight_co", value="0.10", description="Weight for Course Outcome mapping alignment"),
        Setting(key="weight_emerging_tech", value="0.10", description="Weight for Emerging Technology coverage alignment"),
    ]
    db.add_all(settings_list)

    db.commit()
    print("Database seeding completed successfully.")
    db.close()

if __name__ == "__main__":
    seed_database()
