def weighted_match(resume_data: dict, criteria: dict):
    resume_skills = set(s.lower() for s in resume_data.get("skills", []))
    required_skills = set(s.lower() for s in criteria["skills"])

    matched = resume_skills & required_skills
    missing = required_skills - resume_skills

    skill_score = (len(matched) / len(required_skills)) * 70 if required_skills else 0

    resume_exp = resume_data.get("experience", 0)
    required_exp = criteria.get("experience") or 2

    exp_score = 30 if resume_exp >= required_exp else (resume_exp / required_exp) * 30

    final_score = round(skill_score + exp_score, 2)

    return {
        "score": final_score,
        "matched_skills": list(matched),
        "missing_skills": list(missing)
    }
