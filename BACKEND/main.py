from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import urllib.request
import requests
import json
import base64
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="KrishiRakshak API")

# Allow your frontend to communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")
# ==========================================
# 1. LIVE WEATHER ENDPOINT (For Home Page)
# ==========================================
@app.get("/api/weather")
async def get_dashboard_weather(location: str = "Vadlamudi"):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            temp = round(data['main']['temp'])
            humidity = data['main']['humidity']
            wind_speed = round(data['wind']['speed'] * 3.6) # Convert m/s to km/h
            condition = data['weather'][0]['main']
            description = data['weather'][0]['description'].title()
            
            return {
                "status": "success",
                "location": f"{location}, Andhra Pradesh",
                "temp": temp,
                "condition": condition,
                "description": description,
                "humidity": humidity,
                "rain_chance": 85 if "rain" in description.lower() or "thunderstorm" in description.lower() else 0,
                "wind_kmh": wind_speed,
                "hourly": [
                    {"time": "Now", "temp": temp},
                    {"time": "11 AM", "temp": temp + 1},
                    {"time": "12 PM", "temp": temp + 2},
                    {"time": "1 PM", "temp": temp + 3},
                    {"time": "2 PM", "temp": temp + 2},
                    {"time": "3 PM", "temp": temp + 1},
                ]
            }
    except Exception as e:
        print(f"Weather API error: {e}")
    
    # Fallback to realistic local data if the API limit is hit
    return {
        "status": "fallback",
        "location": f"{location}, Andhra Pradesh",
        "temp": 31,
        "condition": "Clear",
        "description": "Mostly Clear",
        "humidity": 62,
        "rain_chance": 0,
        "wind_kmh": 19,
        "hourly": [
            {"time": "Now", "temp": 31},
            {"time": "11 AM", "temp": 32},
            {"time": "12 PM", "temp": 33},
            {"time": "1 PM", "temp": 34},
            {"time": "2 PM", "temp": 34},
            {"time": "3 PM", "temp": 33},
        ]
    }

# ==========================================
# 2. LIVE MANDI PRICES ENDPOINT (For Sell Smarter Page)
# ==========================================
@app.get("/api/prices")
async def get_live_prices():
    try:
        api_key = os.getenv("DATA_GOV_API_KEY")

        if not api_key:
            raise Exception("DATA_GOV_API_KEY is not configured")

        resource_id = "35985678-0d79-46b4-9ed6-6f13308a1d24"

        url = (
            f"https://api.data.gov.in/resource/{resource_id}"
            f"?api-key={api_key}"
            f"&format=json"
            f"&limit=50"
            f"&filters[state]=Andhra%20Pradesh"
        )

        req = urllib.request.Request(
            url,
            headers={"User-Agent": "KrishiRakshak/1.0"}
        )

        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())

        records = data.get("records", [])
        print("RAW RECORD:")
        print(records[0] if records else "NO RECORDS")

        if not records:
            return {
                "status": "success",
                "source": "data.gov.in",
                "count": 0,
                "data": []
            }

        market_data = []

        for record in records:
            def to_number(value):
                try:
                    return float(str(value).replace(",", "").strip())
                except (ValueError, TypeError):
                    return None

            modal_price = to_number(record.get("modal_price"))
            min_price = to_number(record.get("min_price"))
            max_price = to_number(record.get("max_price"))

            market_data.append({
                "crop": record.get("commodity"),
                "variety": record.get("variety"),
                "market": record.get("market"),
                "district": record.get("district"),
                "state": record.get("state"),
                "min_price": min_price,
                "max_price": max_price,
                "modal_price": modal_price,
                "unit": "quintal",
                "arrival_date": record.get("arrival_date"),
                "source": "Government of India - data.gov.in",
                "change": None,
                "trend": None
            })

        return {
            "status": "success",
            "source": "Government of India - data.gov.in",
            "count": len(market_data),
            "data": market_data
        }

    except Exception as e:
        print(f"Error fetching mandi prices: {e}")

        return {
            "status": "error",
            "source": "Government of India - data.gov.in",
            "message": "Unable to fetch current mandi data"
        }


# ==========================================
# 3. DEDICATED IMAGE SCANNER ENDPOINT
# ==========================================
@app.post("/api/scan")
async def scan_crop_endpoint(crop_image: UploadFile = File(...)):
    try:
        content_type = crop_image.content_type # Tells Groq if it is image/webp, image/jpeg, etc.
        image_bytes = await crop_image.read()
        image_data = base64.b64encode(image_bytes).decode('utf-8')
        
        from agent import analyze_crop_structured
        # CRITICAL: Pass the exact mime type to the AI so it doesn't crash on .webp files!
        result = analyze_crop_structured(image_data, content_type)
        
        return {"status": "success", "data": result}
    except Exception as e:
        print(f"Scan API Error: {str(e)}")
        return {"status": "error", "error": f"Vision API Failed: {str(e)}"}

# ==========================================
# 4. BHASHINI MOCK PIPELINE
# ==========================================
def bhashini_speech_to_text(audio_bytes):
    return "What is the live weather in Vadlamudi right now, and should I store my crops?"

def bhashini_text_to_speech(text):
    return "https://krishirakshak-audio-server.com/response_123.mp3"

# ==========================================
# 5. THE TEXT/VOICE AGENT ENDPOINT
# ==========================================
@app.post("/api/ask")
async def ask_krishirakshak(voice_note: UploadFile = File(None), text_query: str = Form(None)):
    farmer_query = ""
    
    if voice_note:
        audio_bytes = await voice_note.read()
        farmer_query = bhashini_speech_to_text(audio_bytes)
    elif text_query:
        farmer_query = text_query
    else:
        return {"error": "Please provide either a voice note or a text query."}
    
    from agent import get_farmer_advice
    ai_text_response = get_farmer_advice(farmer_query)
    audio_response_url = bhashini_text_to_speech(ai_text_response)
    
    return {
        "status": "success",
        "detected_language_text": farmer_query,
        "ai_advice_text": ai_text_response,
        "ai_advice_audio_url": audio_response_url,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)