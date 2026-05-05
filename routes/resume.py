from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_DIR = "data_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Resume uploaded successfully",
        "file_path": file_path
    }
