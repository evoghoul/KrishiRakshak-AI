import os
import json
import base64
import requests
import warnings
import sys
from pydantic import BaseModel, Field

# Safely configure terminal encoding for UTF-8 without breaking uvicorn/streams
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
warnings.filterwarnings("ignore", category=DeprecationWarning)

from offline_ai.vision_classifier import predict_image

OLLAMA_URL = "https://birds-finite-comedy-applicants.trycloudflare.com/api/generate"

def ask_ollama(prompt: str, json_mode: bool = False, model: str = "llama3", images: list = None) -> str:
    """Helper to query local Llama 3 via Ollama."""
    try:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
        }
        if json_mode:
            payload["format"] = "json"
        if images:
            payload["images"] = images
            
        res = requests.post(OLLAMA_URL, json=payload, timeout=120)
        if res.status_code == 200:
            return res.json().get("response", "").strip()
        else:
            print(f"[Ollama Error] Status {res.status_code}: {res.text}")
    except Exception as e:
        print(f"[Ollama Connection Error] Make sure Ollama is running. {e}")
    return ""

def analyze_crop_structured(base64_string: str, mime_type: str = "image/jpeg") -> dict:
    """
    Uses local Llava model to identify crop and disease and generate a structured treatment JSON.
    """
    print("[AI Vision] Analyzing image via local Llava...")
    try:
        prompt = """You are an objective, highly accurate Agricultural Plant Pathologist.
Analyze the provided image of a plant leaf and follow this strict diagnostic process:
1. Crop Identification: Identify the plant/crop type.
2. Visual Metric Analysis: Calculate and observe real metrics:
   - Chlorosis/Yellowing Percentage (0-100%)
   - Turgidity Index (Upright vs Drooping/Wilting)
   - Necrotic Lesion/Spot Density
   - Pest Damage Severity
3. Objective Conclusion: Based STRICTLY on the calculated metrics above, determine if the plant is "Healthy" or suffering from a disease. If chlorosis is 0%, turgidity is high, and there are no lesions, you MUST classify it as healthy. DO NOT invent a disease for a healthy plant.

Output MUST be strictly a single valid JSON object matching this schema exactly (No markdown, no markdown backticks, just raw JSON):
{
  "is_plant": true (or false if it's not a plant),
  "error_type": null (or "invalid_subject" if not a plant),
  "message": null (or error message if not a plant),
  "crop": "Crop Name",
  "calculated_metrics": "List the observed metrics here (e.g., Chlorosis: 0%, Turgidity: High, Lesions: None)",
  "disease": "Disease Name (or 'None' if healthy)",
  "status": "healthy" or "risk" or "alert",
  "confidence": "percentage string, e.g. 95.0%",
  "severity": "Low or Moderate or High or None",
  "treatment": "Precise chemical prescription with exact dosage (or 'None required')",
  "organic_remedy": "Specific organic / bio-control alternative (or 'None required')",
  "task": "Short calendar task title (e.g., 'Monitor plant health')",
  "details": "Your visual analysis based on the metrics."
}
"""
        llama_response = ask_ollama(prompt, json_mode=True, model="llava", images=[base64_string])
        if llama_response:
            try:
                parsed = json.loads(llama_response)
                print(f"[Local AI Success] Diagnosed: {parsed.get('crop')} ({parsed.get('disease')})")
                return parsed
            except Exception as e:
                print(f"[Ollama JSON Parse Error] {e}")
                
        return {
            "is_plant": False,
            "error_type": "processing_error",
            "message": "Failed to analyze image."
        }
    except Exception as e:
        print(f"[Local AI Vision Exception] {e}")
        return {
            "is_plant": False,
            "error_type": "processing_error",
            "message": "An error occurred while processing the image locally."
        }


def get_farmer_advice(query: str, image_base64: str = None) -> str:
    """Uses local Llama 3 for farmer chat."""
    prompt = f"""
    You are KrishiRakshak, an intelligent assistant for Indian farmers. A farmer asks: '{query}'
    1. Detect the language of the query and reply strictly in that same language or dialect.
    2. Keep it simple and advise the farmer.
    """
    response = ask_ollama(prompt)
    if response:
        return response
    
    return f"नमस्ते किसान भाई! आपकी मदद के लिए कृषि रक्षक तैयार है। अपनी फसल की स्थिति जानने के लिए 'Grow Better' टैब में जाकर पत्ती की फोटो स्कैन करें।"