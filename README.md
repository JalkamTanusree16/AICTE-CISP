# AICTE-CISP

## AICTE National Curriculum Intelligence & Standardization Platform

AICTE-CISP is an AI-powered platform designed to help universities analyze and improve their course curricula.

The main idea behind this project is to make curriculum comparison and standardization easier. Universities can upload their curriculum documents, and the system analyzes them against a reference curriculum and identifies areas that need improvement.

## What does it do?

The platform can:

- Upload curriculum documents such as PDF, DOCX, XLSX and CSV
- Extract course and curriculum information from uploaded documents
- Compare university courses with reference curricula
- Check topic and syllabus coverage
- Analyze credit and practical/lab alignment
- Analyze Course Outcomes (COs)
- Check emerging technology coverage
- Calculate an overall curriculum alignment score
- Identify curriculum gaps
- Provide recommendations for improvement
- Maintain curriculum versions and review history
- Generate reports
- Support different user roles such as faculty, university officers and reviewers

## How AI is used

The project uses Natural Language Processing (NLP) and semantic similarity to understand whether two course or topic descriptions are related, even when their wording is different.

We use the `all-MiniLM-L6-v2` Sentence Transformer model to generate text embeddings and compare curriculum content.

For example:

`Data Structures and Algorithms`

can be compared with:

`Data Structures`

and the system can determine how closely they are related.

## Main Technologies

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyMuPDF
- Sentence Transformers
- Scikit-learn

### Database
- SQLite
- PostgreSQL-compatible architecture

### Other
- PDF/DOCX/XLSX processing
- NLP and semantic similarity
- JWT authentication
- PDF and Excel report generation

## How the system works

```text
University uploads curriculum
            ↓
Document is processed
            ↓
Courses and topics are extracted
            ↓
Curriculum is compared with reference standards
            ↓
AI calculates semantic similarity
            ↓
Alignment scores are generated
            ↓
Curriculum gaps are identified
            ↓
Recommendations are generated
            ↓
Reviewer can review and approve
