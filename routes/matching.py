from fastapi import APIRouter
import os

from utils.resume_parser import parse_resume
from utils.matcher import weighted_match

criteria={
    "skills":["Python","FastAPI","SQL","Docker"],
    "experience":2
}
router = APIRouter(
    prefix="/match",
    tags=["Matching"]
)

@router.get("/rank")
def rank_resume():
    resume_data = parse_resume("data_uploads/resume.pdf")
    resume_skills = resume_data["skills"]

    resume_data = {
    "skills": resume_skills,
    "experience": 1   # temporary default
    }

@router.get("/rank-all")
def rank_all_resumes():
    folder = "data_uploads"

    criteria = {
        "skills": ["Python", "FastAPI", "SQL", "Docker"],
        "experience": 2
    }

    results = []

    for filename in os.listdir(folder):
        if not filename.endswith(".pdf"):
            continue

        file_path = os.path.join(folder, filename)

        # parse_resume MUST return a dict with "skills"
        resume_data = parse_resume(file_path)

        # SAFETY: ensure dict format
        resume_data = {
            "skills": resume_data.get("skills", []),
            "experience": resume_data.get("experience", 1)
        }

        result = weighted_match(resume_data, criteria)
        result["filename"] = filename

        results.append(result)

    return sorted(results, key=lambda x: x["score"], reverse=True)

