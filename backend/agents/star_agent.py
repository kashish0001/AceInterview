from agents.llm_helper import run_llm

DEFAULT_MODEL = "llama3"


def generate_star_answer(question: str, notes: str = "", job_role: str = ""):
    # If no notes provided, indicate that context is needed
    if not notes or notes.strip() == "":
        return {"needsContext": True, "message": "Please provide some context about the situation, task, action, or result to generate a personalized STAR answer."}
    
    role_context = f"The candidate is applying for a {job_role} role." if job_role else ""
    
    system_prompt = "You are an expert interview coach specializing in STAR method answers. Always return valid JSON only."
    
    prompt = f"""
You are AceInterview's STAR Answer Generator Agent.

Generate a structured STAR (Situation, Task, Action, Result) answer for the following interview question.

Interview Question: {question}

User Context/Notes: {notes}

{role_context}

Return a JSON object with:
- situation: Clear description of the situation/context
- task: The task or challenge faced
- action: Specific actions taken to address the task
- result: Quantifiable results and outcomes achieved
- fullAnswer: A polished, complete STAR answer combining all elements

Make the answer:
- Professional and concise
- Quantifiable where possible
- Relevant to the question
- Tailored to the job role if provided

Return ONLY valid JSON, no additional text.
"""

    response = run_llm(DEFAULT_MODEL, prompt, system_prompt)
    return response
