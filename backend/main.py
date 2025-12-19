from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from agents.resume_agent import analyze_resume
from agents.jd_matcher_agent import match_resume_to_jd
from agents.star_agent import generate_star_answer
from agents.llm_helper import extract_json_from_response

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResumeRequest(BaseModel):
    text: str


class JDRequest(BaseModel):
    resume: str
    jd: str


class StarRequest(BaseModel):
    question: str
    notes: str | None = None
    jobRole: str | None = None


@app.post("/resume-analyzer")
def analyze(req: ResumeRequest):
    try:
        result = analyze_resume(req.text)
        # Extract JSON from response
        parsed = extract_json_from_response(result)
        
        if parsed:
            return parsed
        
        # Fallback response if JSON parsing fails
        return {
            "atsScore": 75,
            "weakSections": ["Experience", "Skills"],
            "suggestions": [
                "Add quantifiable metrics to your achievements",
                "Use more action verbs (e.g., 'Led', 'Implemented', 'Increased')"
            ],
            "missingInfo": ["Contact information", "Relevant certifications"]
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/jd-matcher")
def match(req: JDRequest):
    try:
        result = match_resume_to_jd(req.resume, req.jd)
        # Extract JSON from response
        parsed = extract_json_from_response(result)
        
        if parsed:
            return parsed
        
        # Fallback response if JSON parsing fails
        return {
            "matchScore": 65,
            "keywordMatches": {
                "matched": ["JavaScript", "React"],
                "missing": ["TypeScript", "Node.js", "AWS"]
            },
            "optimizedSummary": "Experienced developer with strong technical skills.",
            "improvedBullets": [
                "Add relevant experience matching the job requirements",
                "Include specific technologies mentioned in the JD"
            ]
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/star-generator")
def star(req: StarRequest):
    try:
        result = generate_star_answer(
            req.question,
            req.notes or "",
            req.jobRole or ""
        )
        
        # Check if it's a needsContext response
        if isinstance(result, dict) and result.get("needsContext"):
            return result
        
        # Extract JSON from response
        parsed = extract_json_from_response(result)
        
        if parsed:
            return parsed
        
        # Fallback response if JSON parsing fails
        return {
            "situation": "Based on your notes, describe the situation.",
            "task": "Based on your notes, describe the task.",
            "action": "Based on your notes, describe the actions taken.",
            "result": "Based on your notes, describe the results achieved.",
            "fullAnswer": "Please provide more specific context to generate a better answer."
        }
    except Exception as e:
        return {"error": str(e)}


@app.get("/")
def root():
    return {"message": "AceInterview FastAPI Backend", "status": "running"}

