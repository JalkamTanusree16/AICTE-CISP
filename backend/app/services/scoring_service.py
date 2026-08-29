from app.config import settings

def calculate_overall_alignment(
    subject_score: float,
    topic_score: float,
    credit_score: float,
    practical_score: float,
    co_score: float,
    emerging_tech_score: float,
    weights: dict = None
) -> float:
    """
    Dynamically calculates overall curriculum alignment percentage using configurable scoring weights.
    Never hard-codes static alignment percentages!
    """
    w_sub = weights.get("weight_subject", settings.DEFAULT_WEIGHT_SUBJECT) if weights else settings.DEFAULT_WEIGHT_SUBJECT
    w_top = weights.get("weight_topic", settings.DEFAULT_WEIGHT_TOPIC) if weights else settings.DEFAULT_WEIGHT_TOPIC
    w_cre = weights.get("weight_credit", settings.DEFAULT_WEIGHT_CREDIT) if weights else settings.DEFAULT_WEIGHT_CREDIT
    w_pra = weights.get("weight_practical", settings.DEFAULT_WEIGHT_PRACTICAL) if weights else settings.DEFAULT_WEIGHT_PRACTICAL
    w_co  = weights.get("weight_co", settings.DEFAULT_WEIGHT_CO) if weights else settings.DEFAULT_WEIGHT_CO
    w_emg = weights.get("weight_emerging_tech", settings.DEFAULT_WEIGHT_EMERGING_TECH) if weights else settings.DEFAULT_WEIGHT_EMERGING_TECH

    total_weight = w_sub + w_top + w_cre + w_pra + w_co + w_emg
    if total_weight <= 0:
        total_weight = 1.0

    score = (
        (subject_score * w_sub) +
        (topic_score * w_top) +
        (credit_score * w_cre) +
        (practical_score * w_pra) +
        (co_score * w_co) +
        (emerging_tech_score * w_emg)
    ) / total_weight

    return round(float(score), 1)
