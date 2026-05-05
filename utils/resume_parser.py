import pdfplumber
from utils.skills_list import SKILLS

def parse_resume(file_path: str):
    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text.lower()

    found_skills = [skill for skill in SKILLS if skill.lower() in text]

    return {
        "text": text,
        "skills": found_skills
    }
