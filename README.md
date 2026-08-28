# 🌾 KrishiRakshak: AI-Powered Farm Intelligence Agent

KrishiRakshak is an advanced, multilingual, multimodal agricultural assistant designed to bridge information asymmetry for smallholder and rural farmers. Built for Farmers, it combines real-time data ingestion, RAG document retrieval, and a transparent financial decision engine to help farmers **Grow Better, Sell Smarter, and Lose Less.**

---

## 🚀 Key Features

* **🗣️ Multilingual Voice & Multimodal Interface:** Built with a clean, high-contrast White and Light Green UI, supporting voice queries in regional dialects and instant crop disease scanning via camera or photo upload.
* **🌱 Pre-Harvest ("Grow Better"):** Features crop health monitoring, instant AI disease diagnosis (e.g., Early Blight detection with visual metric analysis), daily irrigation/fertilizer schedules, and automated weather-based delay alerts.
* **🌾 Harvest ("Sell Smarter"):** Displays live wholesale Mandi price comparisons, verified direct buyers, and community crop aggregation progress bars (village pooling for bulk price boosts).
* **📦 Post-Harvest ("Lose Less" — Hero Feature):** A multi-factor Explainable AI Decision Engine that analyzes crop type, volume, ambient temperature/humidity, spoilage probability, holding costs, and price forecasts to output a definitive action:
  * `SELL NOW` | `STORE FOR 2 DAYS` | `PROCESS` | `POOL WITH FARMERS`
  * **The "WHY?":** Provides a transparent, plain-language financial breakdown of storage costs versus expected gross price gains.

---

## 🤖 Agents & AI Architecture

Our system relies on highly specialized local and cloud-based agents to perform various intelligent tasks, prioritizing privacy, cost-efficiency, and resilience.

### 1. Vision Pathology Agent (Local Llava via Ollama)
* **Purpose:** Analyzes uploaded or captured crop leaf images to identify diseases and plant health.
* **Mechanism:** Runs locally using the `llava` (large language-and-vision assistant) multimodal model via Ollama. It bypasses expensive cloud APIs, ensuring zero-cost inference.
* **Output:** Generates a structured JSON response containing exact metrics (Chlorosis percentage, Turgidity Index, Lesion Density), crop name, disease classification, and precise chemical/organic treatments.

### 2. Farmer Advisory Chat Agent (Local Llama 3 via Ollama)
* **Purpose:** Acts as a multilingual agronomist. 
* **Mechanism:** Detects the language of the query and replies in the same dialect using `llama3` running locally via Ollama.

### 3. Financial Decision Engine (XGBoost / Random Forest)
* **Purpose:** A deterministic Machine Learning model that processes multidimensional inputs (crop type, local weather, live mandi prices, storage costs).
* **Mechanism:** Outputs explicit financial recommendations (e.g. store or sell) complete with projected net margins and holding costs.

### 4. Semantic Search Agent (RAG)
* **Purpose:** Matches farmers with eligible Government Schemes & Subsidies (e.g., PM-Kisan).
* **Mechanism:** Uses HuggingFace Embeddings (`all-MiniLM-L6-v2`) and ChromaDB vector store for accurate localized retrieval of policy details.

---

## 🔌 API Ecosystem

The backend is built using **FastAPI (Python)** and exposes Several robust endpoints to the Next.js frontend:

* `GET /api/weather?location={loc}`
  * Fetches real-time weather conditions from **OpenWeatherMap API**. Calculates rain probabilities to automatically postpone pesticide or fertilizer application schedules on the frontend.
* `POST /api/scan`
  * Receives multipart form data (Base64 image) and routes it to the local **Llava Agent** for diagnosis. Fallbacks to dummy data gracefully if the local AI server is down.
* `POST /api/decision`
  * Powers the "Lose Less" calculator. Accepts crop name, volume, and storage cost inputs, and runs them through the **Financial Decision Engine** to return a structured financial projection.
* `GET /api/market-prices`
  * Ingests real-time agricultural data from **Data.gov.in** API to provide localized live Mandi (wholesale market) rates for price comparison against MSP (Minimum Support Price).
* `POST /api/voice-guide`
  * Currently routes voice/text queries to the advisory agent. Utilizes local transcription (via **Whisper**) and local TTS (via **pyttsx3**) or **Sarvam AI API** for ultra-realistic local Indian dialect audio responses.

---

## 🛠️ Technology Stack

* **Frontend:** React, Next.js 14, Tailwind CSS, Lucide Icons, Shadcn UI
* **Backend:** Python, FastAPI, Uvicorn
* **Database:** Firebase (Auth, Firestore for user state and scan history storage)
* **Local AI:** Ollama, Llama 3 (Text), Llava (Vision)
* **Machine Learning:** scikit-learn, joblib, Whisper (OpenAI)
* **Vector DB / Embeddings:** ChromaDB, HuggingFace (`all-MiniLM-L6-v2`)

---

## 📂 Project Architecture

```text
KrishiRakshak_App/
│
├── BACKEND/                  # Python FastAPI & AI Agent
│   ├── main.py               # API Server & Endpoints (/api/scan, /api/decision, /api/weather)
│   ├── agent.py              # Llava Vision Agent & Llama 3 setup
│   ├── rag_setup.py          # ChromaDB Vector Store & PDF Loader
│   ├── verify_rag.py         # RAG Source Verification Script
│   ├── offline_ai/           # Local ML Models (XGBoost) & dummy data generators
│   └── requirements.txt      # Python dependencies
│
└── FRONTEND/                 # Next.js / React Web Application
    ├── app/                  # App router pages & layouts
    ├── components/           # Modular UI widgets (Cards, Chips, Chat bubbles, Dashboards)
    └── lib/                  # Firebase config, utility functions
```