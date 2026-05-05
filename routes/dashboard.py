from fastapi import APIRouter
import os
from utils.resume_parser import parse_resume
from utils.matcher import weighted_match

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# Define criteria here (same as matching.py)
criteria = {
    "skills": ["Python", "FastAPI", "SQL", "Docker"],
    "experience": 2
}

@router.get("/")
def dashboard_summary():
    folder = "data_uploads"
    results = []

    # Parse all resumes
    for filename in os.listdir(folder):
        if not filename.endswith(".pdf"):
            continue

        file_path = os.path.join(folder, filename)
        resume_data = parse_resume(file_path)

        # Ensure dictionary format for matcher
        resume_data = {
            "skills": resume_data.get("skills", []),
            "experience": resume_data.get("experience", 1)
        }

        result = weighted_match(resume_data, criteria)
        result["filename"] = filename
        results.append(result)

    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    # Dashboard stats
    total_resumes = len(results)
    top_score = results[0]["score"] if results else 0
    average_score = round(sum(r["score"] for r in results) / total_resumes, 2) if total_resumes else 0

    return {
        "total_resumes": total_resumes,
        "top_score": top_score,
        "average_score": average_score,
        "ranking": results
    }
