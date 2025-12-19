import requests
import json
import re


def run_llm(model: str, prompt: str, system_prompt: str = None) -> str:
    """
    Call Ollama REST API to generate a response.
    
    Args:
        model: The model name (e.g., "llama3")
        prompt: The user prompt
        system_prompt: Optional system prompt
    
    Returns:
        The generated text response
    """
    url = "http://localhost:11434/api/generate"
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    if system_prompt:
        payload["system"] = system_prompt
    
    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        result = response.json()
        return result.get("response", "")
    except requests.exceptions.ConnectionError:
        raise Exception("Cannot connect to Ollama. Make sure Ollama is running on http://localhost:11434")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Ollama API error: {str(e)}")


def extract_json_from_response(response_text: str) -> dict:
    """
    Extract JSON from response text, even if there's extra text around it.
    
    Args:
        response_text: The raw response text
    
    Returns:
        Parsed JSON as a dictionary
    """
    if not response_text:
        return {}
    
    # Try to find JSON object in the response
    json_match = re.search(r'\{[\s\S]*\}', response_text)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass
    
    # If no JSON found, return empty dict
    return {}

