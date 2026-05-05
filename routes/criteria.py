from fastapi import APIRouter

router = APIRouter(
    prefix="/criteria",
    tags=["Criteria"]
)


@router.get("/")
def get_criteria():
    return {
        "skills": ["Python", "FastAPI", "SQL", "Docker"],
        "experience": 2
    }

