from agents.llm_helper import run_llm

DEFAULT_MODEL = "llama3"


def analyze_resume(text: str):
    system_prompt = "You are an expert ATS resume analyzer. Always return valid JSON only."
    
    prompt = f"""
You are AceInterview's Resume Analyzer Agent.

Analyze this resume and return a JSON object with:
- atsScore: number between 0-100
- weakSections: array of section names that need improvement
- suggestions: array of improved bullet points or suggestions
- missingInfo: array of missing information that should be added

Focus on:
1. ATS-friendly formatting and keywords
2. Quantifiable achievements
3. Action verbs
4. Relevant skills and experience
5. Professional structure

Resume:
{text}

Return ONLY valid JSON, no additional text.
"""

    response = run_llm(DEFAULT_MODEL, prompt, system_prompt)
    return response
