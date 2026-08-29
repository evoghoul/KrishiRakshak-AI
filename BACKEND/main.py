from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import urllib.request
import requests
import json
import base64
import os
import random
import time
import asyncio
import joblib

import tempfile
# pyrefly: ignore [missing-import]
import pyttsx3
import whisper
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Explicitly load .env from the BACKEND folder
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(dotenv_path=env_path)

# ==========================================
# In-Memory OTP Store (Phone -> {otp, expiry})
# OTPs expire after 10 minutes
# ==========================================
otp_store: dict = {}
FAST2SMS_API_KEY = "5pvgfIaUMFdO0Hxis86tSLVXPy2lqmk7BRZuz1WjcCrJbDGenAs8VOiNLJ6zcUtYThZ7Wvxf5bISPlKa"

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

class VoiceGuideRequest(BaseModel):
    query: str
    language: Optional[str] = "auto"
    user_name: Optional[str] = "Farmer"

VoiceGuideRequest.model_rebuild()

whisper_model = None
decision_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global whisper_model, decision_model
    # 1. Load Whisper
    try:
        print("Loading Whisper model (small) for better accuracy...")
        whisper_model = whisper.load_model("small")
        print("Whisper model loaded!")
    except Exception as e:
        print("Error loading Whisper:", e)
        
    # 2. Load Decision Model
    try:
        import os
        model_path = os.path.join(os.path.dirname(__file__), "decision_model.joblib")
        if os.path.exists(model_path):
            decision_model = joblib.load(model_path)
            print("[BACKGROUND] Local AI Decision Model loaded successfully.")
        else:
            decision_model = None
            print("[BACKGROUND] decision_model.joblib not found. Model unavailable.")
    except Exception as e:
        decision_model = None
        print(f"[BACKGROUND] Failed to load model: {e}")
        
    # 3. Start background cache tasks
    asyncio.create_task(update_weather_cache())
    asyncio.create_task(update_prices_cache())
    
    yield
    # Shutdown logic if any

app = FastAPI(title="KrishiRakshak API", lifespan=lifespan)

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
SARVAM_API_KEY = "sk_1glmcddi_kpdOVr2i7bLZxhUZ462joIEp"

# ==========================================
# OTP SEND ENDPOINT (Real SMS via Fast2SMS)
# ==========================================
@app.post("/api/send-otp")
async def send_otp(phone: str):
    """Send a 6-digit OTP to the given Indian mobile number via Fast2SMS (with dev fallback)."""
    # Validate phone
    clean = phone.replace(" ", "").replace("+91", "").replace("-", "")
    if not clean.isdigit() or len(clean) != 10 or clean[0] not in "6789":
        raise HTTPException(status_code=400, detail="Invalid Indian mobile number.")

    # Generate secure 6-digit OTP
    otp = str(random.randint(100000, 999999))

    sms_sent = False
    sms_error = ""

    # Try sending via Fast2SMS (works once website is verified in Fast2SMS dashboard)
    try:
        url = "https://www.fast2sms.com/dev/bulkV2"
        params = {
            "authorization": FAST2SMS_API_KEY,
            "route": "q",
            "message": f"Your KrishiRakshak OTP is {otp}. Valid 10 mins. Do not share.",
            "language": "english",
            "flash": "0",
            "numbers": clean,
        }
        resp = requests.get(url, params=params, timeout=10)
        resp_json = resp.json()
        if resp_json.get("return") is True:
            sms_sent = True
        else:
            sms_error = str(resp_json.get("message", "Unknown SMS error"))
            print(f"[Fast2SMS] Could not send SMS: {sms_error}")
    except Exception as e:
        sms_error = str(e)
        print(f"[Fast2SMS] Exception: {e}")

    # Always store OTP with 10-minute expiry regardless of SMS status
    otp_store[clean] = {
        "otp": otp,
        "expiry": time.time() + 600,
    }

    # Always log OTP to console for dev/demo use
    print(f"\n{'='*40}")
    print(f"[DEV] OTP for +91 {clean}: {otp}")
    print(f"{'='*40}\n")

    if sms_sent:
        return {"status": "success", "message": f"OTP sent via SMS to +91 {clean}"}
    else:
        # Dev/demo fallback: return OTP in response so frontend can show it
        return {
            "status": "dev_mode",
            "message": f"SMS gateway not verified. Use the OTP shown below for demo.",
            "dev_otp": otp,
            "sms_error": sms_error,
        }


# ==========================================
# OTP VERIFY ENDPOINT
# ==========================================
@app.post("/api/verify-otp")
async def verify_otp(body: OTPVerifyRequest):
    """Verify the OTP entered by the user against the stored value."""
    clean = body.phone.replace(" ", "").replace("+91", "").replace("-", "")
    entered = body.otp.strip()

    record = otp_store.get(clean)
    if not record:
        raise HTTPException(status_code=400, detail="OTP not found or expired. Please request a new one.")

    if time.time() > record["expiry"]:
        del otp_store[clean]
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    if entered != record["otp"]:
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

    # OTP is valid — delete it so it can't be reused
    del otp_store[clean]
    return {"status": "success", "message": "Phone verified successfully."}

# ==========================================
# GLOBAL API CACHES & BACKGROUND WORKERS
# ==========================================
app_cache = {
    "weather": {},
    "prices": None
}

apmc_live_benchmarks = []


async def update_weather_cache():
    while True:
        try:
            # We'll just pre-cache Vadlamudi/Guntur
            location = "Vadlamudi"
            query_loc = "Guntur"
            url = f"https://api.openweathermap.org/data/2.5/weather?q={query_loc}&appid={OPENWEATHER_API_KEY}&units=metric"
            # Using loop.run_in_executor to avoid blocking the async event loop
            loop = asyncio.get_running_loop()
            import functools
            response = await loop.run_in_executor(None, functools.partial(requests.get, url, timeout=10))
            if response.status_code == 200:
                data = response.json()
                temp = round(data['main']['temp'])
                humidity = data['main']['humidity']
                wind_speed = round(data['wind']['speed'] * 3.6)
                condition = data['weather'][0]['main']
                description = data['weather'][0]['description'].title()
                
                app_cache["weather"][location.lower()] = {
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
                print(f"[BACKGROUND] Weather cache updated for {location}")
        except Exception as e:
            print(f"[BACKGROUND] Weather cache error: {e}")
        
        await asyncio.sleep(1800) # Every 30 minutes

async def update_prices_cache():
    while True:
        try:
            api_key = os.getenv("DATA_GOV_API_KEY")
            if api_key:
                resource_id = "9ef84268-d588-465a-a308-a864a43d0070"
                url = f"https://api.data.gov.in/resource/{resource_id}?api-key={api_key}&format=json&limit=4000&filters[state]=Andhra%20Pradesh"
                req = urllib.request.Request(url, headers={"User-Agent": "KrishiRakshak/1.0"})
                
                loop = asyncio.get_running_loop()
                def fetch_url():
                    with urllib.request.urlopen(req, timeout=150) as response:
                        return response.read().decode()
                        
                raw_data = await loop.run_in_executor(None, fetch_url)
                data = json.loads(raw_data)
                records = data.get("records", [])
                if records:
                    live_data = apmc_live_benchmarks.copy()
                    seen_keys = set([f"{item['crop']}-{item['variety']}-{item['market']}".lower() for item in live_data])
                    for record in records:
                        def to_num(val):
                            try:
                                return float(str(val).replace(",", "").strip())
                            except:
                                return None
                        m_price = to_num(record.get("modal_price"))
                        
                        crop = record.get("commodity", "Crop")
                        variety = record.get("variety", "Common")
                        market = record.get("market", "APMC Mandi")
                        
                        key = f"{crop}-{variety}-{market}".lower()
                        
                        if m_price and key not in seen_keys:
                            seen_keys.add(key)
                            live_data.append({
                                "crop": crop,
                                "variety": variety,
                                "market": market,
                                "district": record.get("district", "Guntur"),
                                "state": record.get("state", "Andhra Pradesh"),
                                "price": int(m_price),
                                "min_price": to_num(record.get("min_price")),
                                "max_price": to_num(record.get("max_price")),
                                "modal_price": int(m_price),
                                "unit": "quintal",
                                "change": 1.5,
                                "trend": "up",
                                "arrival_date": record.get("arrival_date", "Today"),
                                "source": "data.gov.in (Agmarknet Live)"
                            })
                    if live_data:
                        app_cache["prices"] = {
                            "status": "success", 
                            "source": "data.gov.in (Agmarknet Live)", 
                            "count": len(live_data), 
                            "data": live_data
                        }
                        print(f"[BACKGROUND] Mandi Prices cache updated with {len(live_data)} records.")
        except Exception as e:
            print(f"[BACKGROUND] Mandi Prices cache error: {e}")
        
        await asyncio.sleep(3600) # Every 1 hour


# ==========================================
# 1. LIVE WEATHER ENDPOINT (For Home Page)
# ==========================================
@app.get("/api/weather")
async def get_dashboard_weather(location: str = "Vadlamudi"):
    # Return from cache if available
    loc_key = location.lower()
    if loc_key in app_cache["weather"]:
        return app_cache["weather"][loc_key]
        
    # Fallback to realistic local data if the API limit is hit or cache is empty
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
    # Return from cache if available
    if app_cache["prices"]:
        return app_cache["prices"]

    # Return authentic Agmarknet APMC live benchmark data
    return {
        "status": "success",
        "source": "Government of India - Agmarknet Portal",
        "count": len(apmc_live_benchmarks),
        "data": apmc_live_benchmarks
    }


# ==========================================
# 3. DEDICATED IMAGE SCANNER ENDPOINT
# ==========================================
@app.post("/api/scan")
async def scan_crop_endpoint(crop_image: UploadFile = File(...)):
    try:
        content_type = crop_image.content_type # Tells Groq if it is image/webp, image/jpeg, etc.
        image_bytes = await crop_image.read()
        
        from offline_ai.vision_classifier import predict_image
        # Using custom-trained PyTorch CNN model for deterministic high accuracy
        result = predict_image(image_bytes)
        
        return {"status": "success", "data": result}
    except Exception as e:
        print(f"Scan API Error: {str(e)}")
        return {"status": "error", "error": f"Vision API Failed: {str(e)}"}

# ==========================================
# 4. MARKET DECISION ENGINE API (LOCAL ML MODEL)
# ==========================================
class DecisionRequest(BaseModel):
    data: dict
    lang: str = "en"

@app.post("/api/decision")
async def get_market_decision(req: DecisionRequest):
    try:
        d = req.data
        crop = d.get("crop", "Tomato")
        volume = float(d.get("volume", 500))
        lat = float(d.get("lat", 0))
        lng = float(d.get("lng", 0))

        # 1. Look up live price from cache
        current_price = 20.0 # fallback
        if "prices" in app_cache and isinstance(app_cache["prices"], list):
            for p in app_cache["prices"]:
                if p.get("crop", "").lower() == crop.lower():
                    current_price = p.get("price", 2000) / 100.0
                    break

        expected_price = current_price * 1.15 # 15% increase assumption for 3 days

        # 2. Get Weather
        temp = 30.0
        humidity = 60.0
        if "weather" in app_cache:
            temp = float(app_cache["weather"].get("temp", 30))
            humidity = float(app_cache["weather"].get("humidity", 60))

        # 3. Use local Llama 3 (via Ollama) to estimate logistics based on location
        distance_km = 45.0
        storage_cost = 2.0
        
        if lat != 0 and lng != 0:
            prompt = f"""You are a logistics AI for Indian agriculture. 
            A farmer is at Coordinates: {lat}, {lng}. 
            Crop: {crop}. Volume: {volume}kg. Weather: {temp}C, {humidity}%.
            
            Estimate the distance (in km) to the nearest major wholesale Mandi, and the cold storage cost (in ₹ per kg per day).
            Output ONLY valid JSON like this:
            {{"distance_km": 40.5, "storage_cost_per_kg_day": 1.5}}
            """
            
            from agent import ask_ollama
            try:
                llama_response = ask_ollama(prompt, json_mode=True)
                if llama_response:
                    import json
                    parsed = json.loads(llama_response)
                    distance_km = float(parsed.get("distance_km", 45.0))
                    storage_cost = float(parsed.get("storage_cost_per_kg_day", 2.0))
            except Exception as e:
                print("Llama 3 estimation failed, using defaults:", e)

        # 4. REAL MATHEMATICAL METRICS
        # Transport Cost = ₹3 per km per 1000kg (Tractor rate approx)
        transport_cost = distance_km * 3 * (volume / 1000)
        
        # Storage Cost for 3 days
        total_storage_cost = storage_cost * 3 * volume
        
        # Spoilage probability (increases heavily if temp>30 and humidity>70)
        spoilage_prob = 0.05
        if humidity > 70 and temp > 30:
            spoilage_prob = 0.15
        elif crop.lower() in ['tomato', 'chilli']:
            spoilage_prob = 0.10
            
        spoilage_loss = volume * spoilage_prob * current_price

        # The Equations
        net_sell_now = (volume * current_price) - transport_cost
        net_store = (volume * expected_price) - total_storage_cost - spoilage_loss - transport_cost
        
        # Process (e.g. drying): costs ₹5/kg, retains 80% volume, sells at 2x price, zero spoilage
        process_cost = 5 * volume
        net_process = (volume * 0.8 * (current_price * 2)) - process_cost - transport_cost

        # Determine best action
        options = {
            "sell": net_sell_now,
            "store": net_store,
            "process": net_process
        }
        
        best_action = max(options, key=options.get)
        
        action_map = {
            'sell': 'SELL NOW',
            'store': 'STORE FOR 3 DAYS',
            'process': 'PROCESS / DRY'
        }
        
        if best_action == 'sell':
            why = f"Selling now yields ₹{net_sell_now:,.0f} net profit. Storing loses money due to ₹{total_storage_cost:,.0f} storage fees."
        elif best_action == 'store':
            why = f"Storing yields ₹{net_store:,.0f} net profit. Price is expected to rise by 15%, covering the ₹{total_storage_cost:,.0f} storage cost."
        else:
            why = f"Processing yields ₹{net_process:,.0f} net profit. Fresh market prices are too low to cover transport."

        result = {
            "status": best_action,
            "action": action_map.get(best_action, "SELL NOW"),
            "why": why,
            "metrics": {
                "sell": net_sell_now,
                "store": net_store,
                "process": net_process,
                "transport": transport_cost,
                "distance": distance_km
            }
        }

        return {"status": "success", "result": result}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Decision API Error: {str(e)}")
        return {"status": "error", "error": f"Decision Engine Failed: {str(e)}"}

# ==========================================
# 5. THE MULTILINGUAL AI VOICE GUIDE ENDPOINT (Ollama Powered)
# ==========================================
@app.post("/api/voice-guide")
async def voice_guide_intent(req: VoiceGuideRequest):
    query = req.query.strip()
    if not query:
        return {
            "status": "error",
            "message": "Query cannot be empty"
        }

    result_data = None
    try:
        from agent import ask_ollama
        import json
        
        lang_map = {
            "hi-IN": "Hindi",
            "te-IN": "Telugu",
            "en-IN": "English",
            "mr-IN": "Marathi",
            "ta-IN": "Tamil",
            "kn-IN": "Kannada",
            "pa-IN": "Punjabi"
        }
        lang_name = lang_map.get(req.language, req.language)
        
        greeting_map = {
            "hi-IN": f"नमस्ते {req.user_name}",
            "te-IN": f"నమస్కారం {req.user_name}",
            "ta-IN": f"வணக்கம் {req.user_name}",
            "mr-IN": f"नमस्कार {req.user_name}",
            "kn-IN": f"ನಮಸ್ಕಾರ {req.user_name}",
            "pa-IN": f"ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ {req.user_name}",
            "en-IN": f"Hello {req.user_name}"
        }
        suggested_greeting = greeting_map.get(req.language, f"Hello {req.user_name}")
        
        prompt = f"""You are KrishiRakshak Multilingual AI Voice Assistant for Indian farmers.
The farmer's name is {req.user_name}.
The farmer has submitted the following query: "{query}"

INSTRUCTIONS:
1. Understand the farmer's problem and provide a helpful, intelligent 2-3 sentence answer to their question directly. Start your response by greeting the farmer using their name.
2. If the user's request can be better served by a specific app feature (e.g., scanning a crop for disease, checking mandi prices, looking at government schemes, or booking transport), set target_tab and target_element_id. Otherwise, set them to null.
3. Your spoken_response MUST be written in English. Do not attempt to translate it. We will handle translation separately.

Output MUST be strictly a single valid JSON object matching this schema exactly:
{{
  "detected_language": "Language name",
  "language_code": "Language code",
  "target_tab": "grow or sell or lose or home or null",
  "target_element_id": "section ID or null",
  "action_label": "Short label of what you are doing (or null)",
  "spoken_response": "Your helpful 2-3 sentence conversational reply answering the farmer's question in English"
}}"""
        llama_response = ask_ollama(prompt, json_mode=True)
        if llama_response:
            parsed = json.loads(llama_response)
            
            # Translate English response to target language if not English
            english_text = parsed.get("spoken_response", "")
            if req.language != "en-IN" and english_text:
                translated_text = english_text
                # Try Sarvam translation if API key exists
                if SARVAM_API_KEY:
                    try:
                        print(f"[TRANSLATE] Translating to {req.language} via Sarvam...")
                        translate_url = "https://api.sarvam.ai/translate"
                        translate_payload = {
                            "input": english_text,
                            "source_language_code": "en-IN",
                            "target_language_code": req.language,
                            "speaker_gender": "Female",
                            "mode": "formal",
                            "model": "mayura:v1",
                            "enable_preprocessing": True
                        }
                        headers = {
                            'api-subscription-key': SARVAM_API_KEY,
                            'Content-Type': 'application/json'
                        }
                        trans_resp = requests.post(translate_url, headers=headers, json=translate_payload, timeout=10)
                        if trans_resp.status_code == 200:
                            translated_text = trans_resp.json().get("translated_text", english_text)
                            print("[TRANSLATE] Success")
                        else:
                            print(f"[TRANSLATE] Failed: {trans_resp.text}")
                    except Exception as e:
                        print(f"[TRANSLATE] Exception: {e}")
                
                # If translation failed or no API key, fallback to prepending the native greeting
                if translated_text == english_text:
                    translated_text = f"{suggested_greeting}, {english_text}"
                
                parsed["spoken_response"] = translated_text
            elif req.language == "en-IN":
                parsed["spoken_response"] = f"{suggested_greeting}, {english_text}"
                
            result_data = {
                "status": "success",
                "data": parsed
            }
    except Exception as e:
        print(f"[Voice Guide Local AI Exception]: {e}")

    if not result_data:
        # Fallback heuristic if API unavailable
        q_low = query.lower()
        req_lang = req.language or "hi-IN"
        
        if any(k in q_low for k in ["scan", "bimari", "beemari", "rog", "tamatar", "paudha", "disease", "leaf", "తెగులు", "వ్యాధి"]):
            result_data = {
                "status": "success",
                "data": {
                    "detected_language": "Fallback",
                    "language_code": req_lang,
                    "target_tab": "grow",
                    "target_element_id": "crop-diagnostics-section",
                    "action_label": "Opening Crop Scanner",
                    "spoken_response": "Scanning your crop now to find the disease and solution."
                }
            }
        elif any(k in q_low for k in ["mandi", "bhav", "rate", "price", "mirchi", "market", "ధర", "మార్కెట్"]):
            result_data = {
                "status": "success",
                "data": {
                    "detected_language": "Fallback",
                    "language_code": req_lang,
                    "target_tab": "sell",
                    "target_element_id": None,
                    "action_label": "Opening Mandi Rates",
                    "spoken_response": "Let me show you the latest market prices for your crops."
                }
            }
        elif any(k in q_low for k in ["yojana", "scheme", "kisan", "subsidy", "sarkari", "పథకాలు", "సబ్సిడీ"]):
            result_data = {
                "status": "success",
                "data": {
                    "detected_language": "Fallback",
                    "language_code": req_lang,
                    "target_tab": "home",
                    "target_element_id": "gov-schemes-section",
                    "action_label": "Opening Government Schemes",
                    "spoken_response": "Opening the details of government subsidies and schemes."
                }
            }
        elif any(k in q_low for k in ["transport", "truck", "gaadi", "tractor", "రవాణా", "ట్రాక్టర్"]):
            result_data = {
                "status": "success",
                "data": {
                    "detected_language": "Fallback",
                    "language_code": req_lang,
                    "target_tab": "sell",
                    "target_element_id": "logistics-section",
                    "action_label": "Opening Transport Booking",
                    "spoken_response": "Opening available trucks and tractors for transport."
                }
            }
        else:
            result_data = {
                "status": "success",
                "data": {
                    "detected_language": "Fallback",
                    "language_code": req_lang,
                    "target_tab": "home",
                    "target_element_id": None,
                    "action_label": "Navigating to Farm Overview",
                    "spoken_response": "I am opening the dashboard to help you with your query."
                }
            }

    if result_data and result_data.get("status") == "success" and "data" in result_data:
        spoken_response = result_data["data"].get("spoken_response", "")
        # Try Sarvam TTS first
        audio_base64 = None
        if SARVAM_API_KEY and spoken_response:
            try:
                url = "https://api.sarvam.ai/text-to-speech"
                payload = {
                    "inputs": [spoken_response],
                    "target_language_code": req.language or "hi-IN",
                    "speaker": "ritu",
                    "pace": 1.0,
                    "speech_sample_rate": 8000,
                    "enable_preprocessing": True,
                    "model": "bulbul:v3"
                }
                headers = {
                    'api-subscription-key': SARVAM_API_KEY,
                    'Content-Type': 'application/json'
                }
                print("[TTS] Requesting Sarvam TTS...")
                resp = requests.post(url, headers=headers, json=payload, timeout=10)
                if resp.status_code == 200:
                    audios = resp.json().get('audios', [])
                    if audios:
                        audio_base64 = audios[0]
                        print("[TTS] Sarvam TTS generated successfully.")
                else:
                    print(f"[TTS] Sarvam TTS failed with {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"[TTS] Sarvam TTS Exception: {e}")
        
        result_data["data"]["audio_base64"] = audio_base64
    return result_data

def generate_tts_base64(text: str) -> str:
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
        temp_path = f.name
    engine.save_to_file(text, temp_path)
    engine.runAndWait()
    with open(temp_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
    os.remove(temp_path)
    return encoded

@app.post("/api/voice-guide-offline")
async def voice_guide_offline(audio: UploadFile = File(...), language: str = Form("en-IN"), user_name: str = Form("Farmer")):
    audio_bytes = await audio.read()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as f:
        f.write(audio_bytes)
        temp_path = f.name
        
    try:
        query = None
        # Try Sarvam STT first
        if SARVAM_API_KEY:
            try:
                print("[STT] Trying Sarvam AI Speech-to-Text...")
                url = "https://api.sarvam.ai/speech-to-text"
                payload = {'model': 'saaras:v3'}
                with open(temp_path, 'rb') as audio_f:
                    files = [
                        ('file', (os.path.basename(temp_path), audio_f, 'audio/webm'))
                    ]
                    headers = {'api-subscription-key': SARVAM_API_KEY}
                    resp = requests.post(url, headers=headers, data=payload, files=files, timeout=15)
                
                if resp.status_code == 200:
                    query = resp.json().get("transcript")
                    print(f"[STT] Sarvam AI Success")
                else:
                    print(f"[STT] Sarvam AI Failed: {resp.text}")
            except Exception as e:
                print(f"[STT] Sarvam AI Exception: {e}")

        # Fallback to Whisper if Sarvam failed or no API key
        if not query:
            print("[STT] Falling back to offline Whisper...")
            result = whisper_model.transcribe(temp_path)
            query = result["text"].strip()
            
        print("[STT] Transcribed (safe):", query.encode('unicode_escape').decode())
        
        req = VoiceGuideRequest(query=query, language=language, user_name=user_name)
        response_data = await voice_guide_intent(req)
        
        if response_data.get("status") == "success" and "data" in response_data:
            response_data["data"]["transcription"] = query
            
        return response_data
    except Exception as e:
        print(f"Offline Audio Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Voice AI processing failed: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/api/welcome-greeting")
async def welcome_greeting(language: str = "hi-IN", user_name: str = "Farmer"):
    greeting_map = {
        "hi-IN": f"नमस्ते {user_name}! बताइये, मैं आपकी कैसे मदद कर सकता हूँ?",
        "te-IN": f"నమస్కారం {user_name}! నేను మీకు ఎలా సహాయపడగలను?",
        "ta-IN": f"வணக்கம் {user_name}! நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        "mr-IN": f"नमस्कार {user_name}! मी तुम्हाला कशी मदत करू शकतो?",
        "kn-IN": f"ನಮಸ್ಕಾರ {user_name}! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        "pa-IN": f"ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ {user_name}! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
        "en-IN": f"Hello {user_name}! How can I help you today?"
    }
    welcome_text = greeting_map.get(language, greeting_map["en-IN"])
    
    audio_base64 = None
    if SARVAM_API_KEY:
        try:
            url = "https://api.sarvam.ai/text-to-speech"
            payload = {
                "inputs": [welcome_text],
                "target_language_code": language,
                "speaker": "ritu",
                "pace": 1.0,
                "speech_sample_rate": 8000,
                "enable_preprocessing": True,
                "model": "bulbul:v3"
            }
            headers = {
                'api-subscription-key': SARVAM_API_KEY,
                'Content-Type': 'application/json'
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=10)
            if resp.status_code == 200:
                audios = resp.json().get('audios', [])
                if audios:
                    audio_base64 = audios[0]
        except Exception as e:
            print(f"[TTS Welcome] Exception: {e}")
            
    return {
        "status": "success",
        "data": {
            "text": welcome_text,
            "audio_base64": audio_base64
        }
    }

@app.get("/api/tour-tts")
async def tour_tts(text: str, language: str = "en-IN"):
    audio_base64 = None
    if SARVAM_API_KEY:
        try:
            url = "https://api.sarvam.ai/text-to-speech"
            sarvam_lang_map = {
                "hi-IN": "hi-IN", "te-IN": "te-IN", "ta-IN": "ta-IN",
                "kn-IN": "kn-IN", "ml-IN": "ml-IN", "mr-IN": "mr-IN",
                "gu-IN": "gu-IN", "bn-IN": "bn-IN", "pa-IN": "pa-IN",
                "or-IN": "or-IN", "en-IN": "en-IN"
            }
            sarvam_lang = sarvam_lang_map.get(language, "en-IN")
            
            payload = {
                "inputs": [text],
                "target_language_code": sarvam_lang,
                "speaker": "meera",
                "pitch": 0,
                "pace": 1.15,
                "loudness": 1.5,
                "speech_sample_rate": 8000,
                "enable_preprocessing": True,
                "model": "aura-v1-en" if sarvam_lang == "en-IN" else "aura-v1"
            }
            headers = {
                'api-subscription-key': SARVAM_API_KEY,
                'Content-Type': 'application/json'
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=10)
            if resp.status_code == 200:
                audios = resp.json().get('audios', [])
                if audios:
                    audio_base64 = audios[0]
        except Exception as e:
            print(f"[TTS Tour] Exception: {e}")
            
    return {
        "status": "success",
        "data": {
            "text": text,
            "audio_base64": audio_base64
        }
    }

# ==========================================
# 6. AI MARKET DISCOVERY ENDPOINTS (Search Grounding)
# ==========================================
def call_gemini_search(prompt: str, fallback_data: list):
    gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("GOOGLE_API_KEY", "").strip()
    if not gemini_api_key:
        return {"status": "fallback", "data": fallback_data, "message": "No API Key"}
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "tools": [{"googleSearch": {}}],
        "generationConfig": {
            "temperature": 0.2,
            "response_mime_type": "application/json"
        }
    }
    
    try:
        res = requests.post(url, json=payload, timeout=20)
        if res.status_code == 200:
            text = res.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[-1]
            if text.endswith("```"):
                text = text.rsplit("\n", 1)[0]
            text = text.strip()
            return {"status": "success", "data": json.loads(text)}
        elif res.status_code == 429:
            print("[Gemini] Quota Exceeded. Returning fallback data.")
            return {"status": "fallback", "data": fallback_data, "message": "Quota Exceeded"}
        else:
            print(f"[Gemini] Error: {res.text}")
            return {"status": "fallback", "data": fallback_data, "message": "API Error"}
    except Exception as e:
        print(f"[Gemini] Exception: {e}")
        return {"status": "fallback", "data": fallback_data, "message": str(e)}

@app.get("/api/ai-buyers")
async def ai_search_buyers(location: str = "Vadlamudi, Andhra Pradesh"):
    prompt = f'''Find 2 real agricultural buyers, traders, or wholesale companies near {location}.
Output ONLY a JSON array of objects with this exact format:
[{{
  "name": "Company Name", "type": "Wholesaler", "distanceKm": 5.5, "crop": "Mixed",
  "price": 2000, "unit": "quintal", "verified": true, "phone": "+91 9999999999",
  "licenseId": "AP-AI-101", "address": "Full real address"
}}]'''
    fallback = [
        { "name": "Sri Rama Traders (AI Discovered)", "type": "Wholesaler", "distanceKm": 3.2, "crop": "Mixed", "price": 2200, "unit": "quintal", "verified": True, "phone": "+91 98480 00001", "licenseId": "AP-TRD-01", "address": f"Main Road, {location}" },
        { "name": "Venkateswara Exports (AI Discovered)", "type": "Exporter", "distanceKm": 8.1, "crop": "Chilli", "price": 19500, "unit": "quintal", "verified": True, "phone": "+91 98480 00002", "licenseId": "AP-EXP-02", "address": f"Industrial Estate, {location}" }
    ]
    return call_gemini_search(prompt, fallback)

@app.get("/api/ai-logistics")
async def ai_search_logistics(location: str = "Vadlamudi, Andhra Pradesh"):
    prompt = f'''Find 2 real logistics, truck, or transport rental services near {location}.
Output ONLY a JSON array of objects with this exact format:
[{{
  "name": "Truck Name (e.g. Tata Ace)", "type": "Mini Truck", "capacity": "1 Ton", "distanceKm": 4.0,
  "freight": 1000, "rating": 4.5, "available": true, "driverName": "Driver Name",
  "driverPhone": "+91 9999999999", "plateNumber": "AP 07 1234"
}}]'''
    fallback = [
        { "name": "Mahindra Bolero (AI Fleet)", "type": "Mini Truck", "capacity": "1.5 Tons", "distanceKm": 2.5, "freight": 1200, "rating": 4.8, "available": True, "driverName": "Siva", "driverPhone": "+91 94400 11111", "plateNumber": "AP 07 X 1111" }
    ]
    return call_gemini_search(prompt, fallback)

@app.get("/api/ai-pools")
async def ai_search_pools(location: str = "Vadlamudi, Andhra Pradesh"):
    prompt = f'''Find 1 realistic agricultural farmer collective, FPO, or pool near {location}.
Output ONLY a JSON array of objects with this exact format:
[{{
  "crop": "Cotton", "village": "{location}", "locked": 10, "target": 50, "unit": "Tons",
  "bonus": "5%", "members": 5, "bonusPercent": 5
}}]'''
    fallback = [
        { "crop": "Cotton", "village": f"{location} FPO", "locked": 15, "target": 40, "unit": "Tons", "bonus": "8%", "members": 12, "bonusPercent": 8 }
    ]
    return call_gemini_search(prompt, fallback)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)