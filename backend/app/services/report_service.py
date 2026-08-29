import os
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.config import settings

def generate_pdf_report(comparison_data: dict, university_name: str = "University", program_name: str = "B.Tech CSE", filename: str = "report.pdf") -> str:
    """
    Generates an official Government of India / AICTE branded PDF analysis report with live DB metrics.
    Returns absolute file path of generated PDF.
    """
    filepath = os.path.join(settings.REPORTS_DIR, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)

    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        textColor=colors.HexColor('#000000'),
        alignment=1, # Center
        spaceAfter=6
    )

    sub_style = ParagraphStyle(
        'SubStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor('#000000'),
        alignment=1,
        spaceAfter=12
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#000000'),
        leading=12
    )

    story = []
    story.append(Paragraph("ALL INDIA COUNCIL FOR TECHNICAL EDUCATION", header_style))
    story.append(Paragraph("<b>AICTE National Curriculum Intelligence & Standardization Portal (CISP)</b>", sub_style))
    story.append(Paragraph(f"<b>STATUTORY STANDARDIZATION & AUDIT REPORT — {university_name.upper()}</b>", styles['Heading3']))
    story.append(Spacer(1, 8))

    summary_text = f"""
    <b>Target Institution:</b> {university_name}<br/>
    <b>Program:</b> {program_name} (2027–28)<br/>
    <b>Report Date:</b> {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}<br/>
    <b>Overall Alignment Score:</b> {comparison_data.get('overall_score', 0.0)}%<br/>
    <b>Sub-Score Breakdown:</b> Subject Title: {comparison_data.get('subject_score', 0.0)}% | Topic Coverage: {comparison_data.get('topic_score', 0.0)}% | Credit Alignment: {comparison_data.get('credit_score', 0.0)}% | Practical/Lab: {comparison_data.get('practical_score', 0.0)}% | CO Alignment: {comparison_data.get('co_score', 0.0)}% | Emerging Tech: {comparison_data.get('emerging_tech_score', 0.0)}%<br/>
    <b>Embedding Engine:</b> {comparison_data.get('embedding_engine', 'SentenceTransformer (all-MiniLM-L6-v2)')}<br/>
    <b>Governance Status:</b> AI-Assisted Analysis (Requires Human Academic Council Sign-Off)
    """
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 14))

    # Table of comparison items
    table_data = [["Reference Course", "University Course", "Score", "Status", "Evidence Location & Recommendation"]]
    for item in comparison_data.get("items", []):
        ref_t = item.get("ref_course_title", "—")[:25]
        uni_t = item.get("uni_course_title", "—")[:25]
        score_str = f"{int(item.get('similarity_score', 0)*100)}%"
        status_str = item.get("status", "—")
        rec_str = (item.get("evidence_location") or item.get("recommendation") or "Aligned")[:45]
        
        table_data.append([
            Paragraph(f"<b>{ref_t}</b>", body_style),
            Paragraph(uni_t, body_style),
            Paragraph(score_str, body_style),
            Paragraph(status_str, body_style),
            Paragraph(rec_str, body_style)
        ])

    t = Table(table_data, colWidths=[110, 110, 45, 65, 210])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e8f0')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#000000')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#94a3b8')),
    ]))
    story.append(t)

    doc.build(story)
    return filepath

def generate_excel_report(comparison_data: dict, university_name: str = "University", program_name: str = "B.Tech CSE", filename: str = "report.xlsx") -> str:
    """
    Generates a multi-sheet Excel workbook of the curriculum comparison & gap analysis.
    Returns absolute file path of generated Excel.
    """
    filepath = os.path.join(settings.REPORTS_DIR, filename)
    items = comparison_data.get("items", [])
    
    summary_data = [{
        "Institution": university_name,
        "Program": program_name,
        "Overall Alignment Score": f"{comparison_data.get('overall_score', 0.0)}%",
        "Subject Score": f"{comparison_data.get('subject_score', 0.0)}%",
        "Topic Score": f"{comparison_data.get('topic_score', 0.0)}%",
        "Credit Score": f"{comparison_data.get('credit_score', 0.0)}%",
        "Practical Score": f"{comparison_data.get('practical_score', 0.0)}%",
        "CO Score": f"{comparison_data.get('co_score', 0.0)}%",
        "Emerging Tech Score": f"{comparison_data.get('emerging_tech_score', 0.0)}%",
        "Embedding Engine": comparison_data.get('embedding_engine', 'SentenceTransformer')
    }]

    with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
        pd.DataFrame(summary_data).to_excel(writer, sheet_name="Summary", index=False)
        pd.DataFrame(items).to_excel(writer, sheet_name="Course Matrix", index=False)
        
        # Gaps sheet
        gaps = [i for i in items if i.get("status") in ["Missing", "Partial Match"]]
        pd.DataFrame(gaps).to_excel(writer, sheet_name="Detected Gaps", index=False)

    return filepath
