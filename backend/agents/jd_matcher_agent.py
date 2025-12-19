from agents.llm_helper import run_llm

DEFAULT_MODEL = "llama3"


def match_resume_to_jd(resume: str, jd: str):
    system_prompt = "You are an expert resume-to-job-description matcher. Always return valid JSON only."
    
    prompt = f"""
You are AceInterview's JD Matcher Agent.

Compare the resume to the job description and return a JSON object with:
- matchScore: number between 0-100
- keywordMatches: object with "matched" (array) and "missing" (array) keywords
- optimizedSummary: a 2-3 sentence resume summary tailored to this job
- improvedBullets: array of 3-5 improved bullet points that better match the JD

Focus on:
1. Keyword alignment
2. Skill matching
3. Experience relevance
4. Industry-specific terminology

Resume: {resume}

Job Description: {jd}

Return ONLY valid JSON, no additional text.
"""

    response = run_llm(DEFAULT_MODEL, prompt, system_prompt)
    return response
