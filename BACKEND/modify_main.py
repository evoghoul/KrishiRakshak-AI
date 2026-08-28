import re

file_path = "c:/KrishiRakshak-AI-main/BACKEND/main.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add pandas and joblib imports
if "import joblib" not in content:
    content = content.replace("import asyncio", "import asyncio\nimport joblib\nimport pandas as pd")

# 2. Add global model loading to startup
startup_logic = """@app.on_event("startup")
async def startup_event():
    global decision_model
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
        
    asyncio.create_task(update_weather_cache())"""
content = re.sub(r'@app\.on_event\("startup"\)\nasync def startup_event\(\):\n    asyncio\.create_task\(update_weather_cache\(\)\)', startup_logic, content)

# 3. Add the Decision API endpoint
decision_api = """# ==========================================
# 4. MARKET DECISION ENGINE API (LOCAL ML MODEL)
# ==========================================
class DecisionRequest(BaseModel):
    data: dict
    lang: str = "en"

@app.post("/api/decision")
async def get_market_decision(req: DecisionRequest):
    try:
        if 'decision_model' not in globals() or decision_model is None:
            return {"status": "error", "error": "Local AI Model not loaded."}
            
        d = req.data
        # Extract features
        current_price = float(d.get("currentPrice", 0))
        expected_price = float(d.get("expectedPrice", 0))
        distance_km = float(d.get("distance", 0))
        storage_cost = float(d.get("storageCost", 0))
        has_storage = 1 if d.get("storageAvailable", "No").lower() == "yes" else 0
        
        # Parse temp/humidity from e.g. "31°C / 62%"
        temp_humidity = d.get("tempHumidity", "30°C / 60%")
        import re as regex
        temp = 30.0
        humidity = 60.0
        match = regex.search(r"(\d+).*?(\d+)", temp_humidity)
        if match:
            temp = float(match.group(1))
            humidity = float(match.group(2))

        # Build feature DataFrame
        import pandas as pd
        df = pd.DataFrame([{
            'current_price': current_price,
            'expected_price': expected_price,
            'distance_km': distance_km,
            'storage_cost': storage_cost,
            'has_storage': has_storage,
            'temp': temp,
            'humidity': humidity
        }])

        # Predict using local ML model
        prediction = decision_model.predict(df)[0] # 'sell', 'store', 'pool', or 'process'
        
        # Build explanation
        action_map = {
            'sell': 'SELL NOW',
            'store': 'STORE FOR 3 DAYS',
            'pool': 'STORE FOR 3 DAYS (POOL TRANSPORT)',
            'process': 'PROCESS / DRY'
        }
        
        profit_margin = expected_price - current_price
        
        if prediction == 'sell':
            why = f"Current market price (₹{current_price}/kg) is extremely favorable relative to expected price. Selling now avoids any spoilage risk and storage fees."
        elif prediction == 'store':
            why = f"Expected price jumps to ₹{expected_price}/kg. The expected profit margin (+₹{profit_margin}/kg) is significantly higher than your storage cost (₹{storage_cost}/kg). Temperature ({temp}°C) indicates spoilage risk is manageable."
        elif prediction == 'pool':
            why = f"Distance ({distance_km}km) requires pooling with nearby farmers to reduce logistics costs, but storing for a future expected price of ₹{expected_price}/kg is highly profitable."
        else:
            why = f"Temperature ({temp}°C) and Humidity ({humidity}%) make spoilage extremely likely, or you lack storage. To avoid a total loss, immediately process the crop."

        # Pass it as JSON
        result = {
            "status": prediction,
            "action": action_map.get(prediction, "SELL NOW"),
            "why": why
        }

        return {"status": "success", "result": result}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Decision API Error: {str(e)}")
        return {"status": "error", "error": f"Decision Engine Failed: {str(e)}"}

# ==========================================
# 5. THE MULTILINGUAL AI VOICE GUIDE ENDPOINT (Gemini Powered)"""

content = content.replace("# ==========================================\n# 5. THE MULTILINGUAL AI VOICE GUIDE ENDPOINT (Gemini Powered)", decision_api)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated main.py successfully with Local AI.")
