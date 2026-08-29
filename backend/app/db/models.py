from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False) # super_admin, reviewer, university_admin, faculty, public
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    university = relationship("University", back_populates="users")

class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    type = Column(String, nullable=False) # Central, State, Deemed, Private, Autonomous
    address = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    status = Column(String, default="APPROVED") # APPROVED, PENDING, SUSPENDED
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="university")
    curricula = relationship("UniversityCurriculum", back_populates="university")

class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    degree_level = Column(String, nullable=False) # B.Tech, M.Tech, MBA, MCA, Pharmacy, Diploma
    branch = Column(String, nullable=False) # Computer Science, Electrical, Mechanical, Civil, etc.
    duration_years = Column(Integer, default=4)
    total_credits = Column(Integer, default=160)
    created_at = Column(DateTime, default=datetime.utcnow)

    reference_curricula = relationship("ReferenceCurriculum", back_populates="program")
    university_curricula = relationship("UniversityCurriculum", back_populates="program")

class ReferenceCurriculum(Base):
    __tablename__ = "reference_curricula"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    academic_year = Column(String, nullable=False) # e.g. 2027-28
    version = Column(String, nullable=False, default="v1.0")
    status = Column(String, default="PUBLISHED") # PUBLISHED, DRAFT, ARCHIVED
    description = Column(Text, nullable=True)
    created_by = Column(String, default="AICTE Academic Council")
    created_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program", back_populates="reference_curricula")
    courses = relationship("Course", back_populates="reference_curriculum", cascade="all, delete-orphan")

class UniversityCurriculum(Base):
    __tablename__ = "university_curricula"

    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    reference_curriculum_id = Column(Integer, ForeignKey("reference_curricula.id"), nullable=True)
    academic_year = Column(String, nullable=False)
    version = Column(String, nullable=False, default="v1.0")
    status = Column(String, default="DRAFT") # DRAFT, UPLOADED, UNDER_REVIEW, CHANGES_REQUESTED, APPROVED, PUBLISHED
    alignment_score = Column(Float, default=0.0)
    submitted_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    university = relationship("University", back_populates="curricula")
    program = relationship("Program", back_populates="university_curricula")
    documents = relationship("Document", back_populates="curriculum", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="university_curriculum", cascade="all, delete-orphan")
    comparisons = relationship("Comparison", back_populates="university_curriculum", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="curriculum", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    curriculum_type = Column(String, nullable=False) # REFERENCE or UNIVERSITY
    reference_curriculum_id = Column(Integer, ForeignKey("reference_curricula.id"), nullable=True)
    university_curriculum_id = Column(Integer, ForeignKey("university_curricula.id"), nullable=True)
    
    semester = Column(Integer, nullable=False)
    code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    course_type = Column(String, default="CORE") # CORE, ELECTIVE, LAB, PROJECT, MANDATORY
    credits = Column(Float, default=4.0)
    lecture_hours = Column(Integer, default=3)
    tutorial_hours = Column(Integer, default=1)
    practical_hours = Column(Integer, default=0)
    prerequisites = Column(String, nullable=True)
    objectives = Column(Text, nullable=True)
    taxonomy_tags = Column(String, nullable=True) # AI, Cloud, Cyber, Data, etc.

    reference_curriculum = relationship("ReferenceCurriculum", back_populates="courses")
    university_curriculum = relationship("UniversityCurriculum", back_populates="courses")
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")
    outcomes = relationship("CourseOutcome", back_populates="course", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    unit_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    hours = Column(Integer, default=8)
    topics = Column(Text, nullable=False) # JSON or comma/newline separated text

    course = relationship("Course", back_populates="units")

class CourseOutcome(Base):
    __tablename__ = "course_outcomes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    co_code = Column(String, nullable=False) # e.g. CO1, CO2
    description = Column(Text, nullable=False)
    po_mappings = Column(JSON, nullable=True) # e.g. {"PO1": 3, "PO2": 2, "PO3": 1}

    course = relationship("Course", back_populates="outcomes")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    university_curriculum_id = Column(Integer, ForeignKey("university_curricula.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # pdf, docx, xlsx, csv
    file_size = Column(Integer, default=0)
    status = Column(String, default="PROCESSED") # UPLOADED, PROCESSING, EXTRACTED, FAILED
    upload_date = Column(DateTime, default=datetime.utcnow)

    curriculum = relationship("UniversityCurriculum", back_populates="documents")
    processing_jobs = relationship("ProcessingJob", back_populates="document", cascade="all, delete-orphan")

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    status = Column(String, default="COMPLETED") # PENDING, PROCESSING, COMPLETED, FAILED
    current_step = Column(String, default="COMPLETED")
    total_steps = Column(Integer, default=7)
    progress_pct = Column(Float, default=100.0)
    message = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=True)
    extracted_structure = Column(JSON, nullable=True)
    error_log = Column(Text, nullable=True)

    document = relationship("Document", back_populates="processing_jobs")

class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(Integer, primary_key=True, index=True)
    university_curriculum_id = Column(Integer, ForeignKey("university_curricula.id"), nullable=False)
    reference_curriculum_id = Column(Integer, ForeignKey("reference_curricula.id"), nullable=False)
    overall_score = Column(Float, default=0.0)
    subject_score = Column(Float, default=0.0)
    topic_score = Column(Float, default=0.0)
    credit_score = Column(Float, default=0.0)
    practical_score = Column(Float, default=0.0)
    co_score = Column(Float, default=0.0)
    emerging_tech_score = Column(Float, default=0.0)
    analysis_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    university_curriculum = relationship("UniversityCurriculum", back_populates="comparisons")
    items = relationship("ComparisonItem", back_populates="comparison", cascade="all, delete-orphan")

class ComparisonItem(Base):
    __tablename__ = "comparison_items"

    id = Column(Integer, primary_key=True, index=True)
    comparison_id = Column(Integer, ForeignKey("comparisons.id"), nullable=False)
    ref_course_title = Column(String, nullable=False)
    ref_topic = Column(String, nullable=True)
    uni_course_title = Column(String, nullable=True)
    uni_topic = Column(String, nullable=True)
    similarity_score = Column(Float, default=0.0)
    status = Column(String, nullable=False) # Matched, Partial Match, Missing, Outdated, Extra
    match_type = Column(String, default="Cosine Similarity (TF-IDF/Embeddings)")
    evidence_location = Column(String, nullable=True)
    gap_description = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=True)

    comparison = relationship("Comparison", back_populates="items")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    university_curriculum_id = Column(Integer, ForeignKey("university_curricula.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="PENDING") # PENDING, APPROVED, CHANGES_REQUESTED, REJECTED
    decision = Column(String, nullable=True)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    curriculum = relationship("UniversityCurriculum", back_populates="reviews")
    comments_rel = relationship("Comment", back_populates="review", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    author_name = Column(String, nullable=False)
    course_id = Column(Integer, nullable=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    review = relationship("Review", back_populates="comments_rel")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="CIRCULAR") # CIRCULAR, ANNOUNCEMENT, POLICY, GUIDELINE
    publish_date = Column(String, nullable=False)
    link_url = Column(String, nullable=True)
    is_important = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EmergingTechnology(Base):
    __tablename__ = "emerging_technologies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # AI, Cloud, Security, Systems, Data
    description = Column(Text, nullable=True)
    key_topics = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
