from app.services.embedding_service import compute_similarity, get_embedding_engine_info
from app.services.scoring_service import calculate_overall_alignment

EMERGING_TECH_KEYWORDS = [
    "artificial intelligence", "machine learning", "deep learning", "neural network",
    "cloud computing", "cybersecurity", "cyber security", "cryptography", "devops",
    "quantum computing", "internet of things", "iot", "robotics", "automation",
    "blockchain", "green technology", "generative ai", "data science"
]

BLOOM_TAXONOMY_MAP = {
    "remember": ["define", "list", "recall", "state", "identify", "name"],
    "understand": ["explain", "describe", "discuss", "summarize", "interpret"],
    "apply": ["apply", "solve", "use", "demonstrate", "implement", "execute"],
    "analyze": ["analyze", "differentiate", "examine", "compare", "contrast", "investigate"],
    "evaluate": ["evaluate", "assess", "judge", "critique", "validate"],
    "create": ["design", "formulate", "construct", "develop", "create", "synthesize"]
}

def detect_bloom_level(text: str) -> tuple[str, float]:
    low_text = text.lower()
    for level, words in BLOOM_TAXONOMY_MAP.items():
        if any(w in low_text for w in words):
            return level.capitalize(), 0.90
    return "Understand", 0.75

def run_semantic_comparison(ref_courses: list[dict], uni_courses: list[dict], weights_config: dict = None) -> dict:
    """
    Performs full semantic comparison between AICTE Reference Standards and University Curriculum.
    Generates dynamic sub-scores, vector similarity matching, evidence-backed gaps, and recommendations.
    """
    engine_info = get_embedding_engine_info()
    items = []
    
    # Track overall metrics
    total_ref_credits = 0.0
    total_uni_credits = 0.0
    matched_lab_count = 0
    ref_lab_count = 0
    emerging_tech_matches = 0
    co_similarities = []

    for ref in ref_courses:
        ref_title = ref.get("title", "")
        ref_code = ref.get("code", "")
        ref_credits = float(ref.get("credits", 4.0))
        ref_prac = int(ref.get("practical_hours", 0))
        total_ref_credits += ref_credits
        if ref_prac > 0 or "lab" in ref_title.lower():
            ref_lab_count += 1

        ref_topics = " ".join([u.get("topics", "") for u in ref.get("units", [])])
        ref_text = f"{ref_title} {ref_topics} {ref.get('taxonomy_tags', '')}"

        best_match = None
        best_sim = 0.0

        for uni in uni_courses:
            uni_title = uni.get("title", "")
            uni_topics = " ".join([u.get("topics", "") for u in uni.get("units", [])])
            uni_text = f"{uni_title} {uni_topics} {uni.get('taxonomy_tags', '')}"

            sim = compute_similarity(ref_text, uni_text)
            if sim > best_sim:
                best_sim = sim
                best_match = uni

        uni_credits = float(best_match.get("credits", 0.0)) if best_match and best_sim >= 0.50 else 0.0
        total_uni_credits += uni_credits

        source_pg = best_match.get("source_page", 1) if best_match else 1

        # Check lab match
        if best_match and best_sim >= 0.50:
            if int(best_match.get("practical_hours", 0)) > 0 or "lab" in best_match.get("title", "").lower():
                matched_lab_count += 1

        # Check emerging tech coverage
        if any(tech in ref_text.lower() for tech in EMERGING_TECH_KEYWORDS):
            if best_match and best_sim >= 0.65:
                emerging_tech_matches += 1

        # CO alignment evaluation
        ref_cos = ref.get("outcomes", [])
        uni_cos = best_match.get("outcomes", []) if best_match else []
        if ref_cos and uni_cos:
            r_co_text = " ".join([co.get("description", "") for co in ref_cos])
            u_co_text = " ".join([co.get("description", "") for co in uni_cos])
            co_sim = compute_similarity(r_co_text, u_co_text)
            co_similarities.append(co_sim)

        if best_sim >= 0.80:
            status = "Matched"
            evidence = f"Source Page {source_pg} — High semantic alignment with '{best_match.get('title')}' ({best_match.get('code')})"
            gap_desc = None
            rec = None
        elif best_sim >= 0.50:
            status = "Partial Match"
            evidence = f"Source Page {source_pg} — Partial topic overlap with '{best_match.get('title')}' ({best_match.get('code')})"
            gap_desc = f"Topic coverage in '{best_match.get('title')}' lacks modern modules present in reference standard."
            rec = f"Enhance syllabus of '{best_match.get('title')}' by incorporating missing AICTE reference units."
        else:
            status = "Missing"
            evidence = "No semantically equivalent subject or unit found in uploaded curriculum document."
            gap_desc = f"Missing core AICTE reference course: '{ref_title}' ({ref_code})."
            rec = f"Introduce '{ref_title}' as a core course in Semester {ref.get('semester', 6)}."

        items.append({
            "ref_course_title": ref_title,
            "ref_topic": ref_topics[:120] if ref_topics else "Standard AICTE Unit Topics",
            "uni_course_title": best_match.get("title") if best_match and best_sim >= 0.50 else "—",
            "uni_topic": " ".join([u.get("topics", "") for u in best_match.get("units", [])])[:120] if best_match and best_sim >= 0.50 else "—",
            "similarity_score": round(best_sim, 2),
            "status": status,
            "match_type": f"{engine_info['engine']}",
            "evidence_location": evidence,
            "gap_description": gap_desc,
            "recommendation": rec
        })

    # Sub-score calculations
    if items:
        subject_score = round(sum(100.0 if i["status"] == "Matched" else (60.0 if i["status"] == "Partial Match" else 0.0) for i in items) / len(items), 1)
        topic_score = round(sum(i["similarity_score"] * 100 for i in items) / len(items), 1)
    else:
        subject_score = 0.0
        topic_score = 0.0

    credit_ratio = min(1.0, total_uni_credits / max(1.0, total_ref_credits)) if total_ref_credits > 0 else 0.85
    credit_score = round(credit_ratio * 100, 1)

    lab_ratio = (matched_lab_count / max(1, ref_lab_count)) if ref_lab_count > 0 else 0.80
    practical_score = round(lab_ratio * 100, 1)

    co_score = round((sum(co_similarities) / len(co_similarities) * 100) if co_similarities else 82.5, 1)
    emerging_tech_score = round(min(100.0, max(50.0, (emerging_tech_matches + 1) * 22.5)), 1)

    overall_score = calculate_overall_alignment(
        subject_score, topic_score, credit_score, practical_score, co_score, emerging_tech_score, weights_config
    )

    return {
        "overall_score": overall_score,
        "subject_score": subject_score,
        "topic_score": topic_score,
        "credit_score": credit_score,
        "practical_score": practical_score,
        "co_score": co_score,
        "emerging_tech_score": emerging_tech_score,
        "embedding_engine": engine_info["engine"],
        "items": items
    }
