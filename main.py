from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.resume import router as resume_router
from routes.criteria import router as criteria_router
from routes.matching import router as matching_router
from routes.dashboard import router as dashboard_router
from fastapi import UploadFile,File
import shutil



app = FastAPI(title="Resume Matcher Backend")

app.include_router(resume_router)
app.include_router(criteria_router)
app.include_router(matching_router)
app.include_router(dashboard_router)
@app.post("/upload")
async def upload_resume(file:UploadFile=File(...)):
    file_location=f"resumes/{file.filename}"
    with open(file_location,"wb") as buffer:
        shutil.copyfileobj(file.file,buffer)
    return{"message":"File uploaded successfully"}
@app.get("/")
def root():
    return {"message": "Resume Matcher Backend Running"}

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
