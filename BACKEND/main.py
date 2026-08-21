from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import base64
import os

# Import the brain you just built!
from agent import get_farmer_advice

app = FastAPI(title="KrishiRakshak API")

# Allow your frontend (Flutter/React/Web) to communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# BHASHINI MOCK PIPELINE (To be replaced with real Bhashini keys later)
# ==========================================
def bhashini_speech_to_text(audio_bytes):
    """Simulates converting the farmer's spoken audio into text."""
    # We will hardcode a test query here for now to prove the API connects to the agent
    return "What is the live weather in Vadlamudi right now, and should I store my crops?"

def bhashini_text_to_speech(text):
    """Simulates converting Gemini's text back into a regional audio file."""
    return "https://krishirakshak-audio-server.com/response_123.mp3"

# ==========================================
# THE MAIN ENDPOINT (The Bridge)
# ==========================================
@app.post("/api/ask")
async def ask_krishirakshak(
    voice_note: UploadFile = File(None),
    crop_image: UploadFile = File(None),
    text_query: str = Form(None)
):
    farmer_query = ""
    image_data = None

    # 1. PROCESS THE EARS (Audio -> Text)
    if voice_note:
        audio_bytes = await voice_note.read()
        farmer_query = bhashini_speech_to_text(audio_bytes)
    elif text_query:
        farmer_query = text_query
    else:
        return {"error": "Please provide either a voice note or a text query."}

    # 2. PROCESS THE EYES (Image -> Base64)
    if crop_image:
        image_bytes = await crop_image.read()
        # Convert image to a string format that Gemini Flash can "see"
        image_data = base64.b64encode(image_bytes).decode('utf-8')

    # 3. ENGAGE THE BRAIN (Agent Execution)
    # Right now, our agent only accepts text. We will upgrade it to accept the image_data next!
    ai_text_response = get_farmer_advice(farmer_query)

    # 4. GENERATE THE MOUTH (Text -> Audio)
    audio_response_url = bhashini_text_to_speech(ai_text_response)

    # 5. RETURN EVERYTHING TO THE FRONTEND
    return {
        "status": "success",
        "detected_language_text": farmer_query,
        "ai_advice_text": ai_text_response,
        "ai_advice_audio_url": audio_response_url,
    }

if __name__ == "__main__":
    import uvicorn
    # Starts the local development server
    uvicorn.run(app, host="0.0.0.0", port=8000)