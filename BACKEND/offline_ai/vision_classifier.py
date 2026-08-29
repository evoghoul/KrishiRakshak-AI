import base64
import json
import requests
import io

def load_model():
    """Warms up the Ollama model (not strictly necessary, but confirms connection)"""
    try:
        print("Checking connection to Local Ollama Vision Model (LLaVA)...")
        response = requests.get("http://localhost:11434/")
        if response.status_code == 200:
            print("[BACKGROUND] Local Ollama Vision Model connected successfully.")
        else:
            print("Warning: Ollama server responded with an error.")
    except Exception as e:
        print(f"Warning: Could not connect to Ollama on http://localhost:11434. Make sure Ollama is running.")

def predict_image(image_bytes: bytes) -> dict:
    """Predicts the disease from image bytes using the Local Ollama LLaVA model."""
    try:
        # Encode image to Base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        # Prepare the strict prompt for JSON extraction
        prompt = '''You are an expert Indian agricultural botanist and plant pathologist. 
Analyze the provided crop image and respond with ONLY a raw JSON object containing these exact 4 keys:
1. "crop": (string) The name of the crop (e.g., "Rice", "Sugarcane", "Tomato", etc.).
2. "condition": (string) The disease or health status (e.g., "Brown Spot", "Healthy").
3. "confidence": (string) Your confidence percentage (e.g., "95.00%").
4. "task": (string) A concise 1-sentence recommended treatment or task for the farmer.

If the image is NOT a plant, set crop to "Unknown Crop" and condition to "non_crop".
DO NOT output any markdown blocks, backticks, or other text. ONLY the JSON object.'''

        payload = {
            "model": "llava",
            "prompt": prompt,
            "images": [base64_image],
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1
            }
        }
        
        # Call Local Ollama API
        response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=60)
        
        if response.status_code == 200:
            result_json = response.json()
            response_text = result_json.get("response", "").strip()
            
            # Parse the JSON response
            try:
                data = json.loads(response_text)
                return {
                    "status": "success",
                    "raw_class": f"{data.get('crop', '')}___{data.get('condition', '')}".replace(" ", "_"),
                    "crop": data.get("crop", "Unknown Crop"),
                    "condition": data.get("condition", "Unknown Condition"),
                    "confidence": str(data.get("confidence", "90.00%")),
                    "is_plant": "non_crop" not in data.get("condition", "").lower(),
                    "task": data.get("task", "Monitor plant closely and ensure adequate watering and sunlight.")
                }
            except json.JSONDecodeError:
                return {
                    "status": "error",
                    "message": f"Failed to parse LLM response: {response_text}"
                }
        else:
            return {
                "status": "error",
                "message": f"Ollama API Error: {response.status_code}"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
