# 🌾 KrishiRakshak: AI-Powered Farm Intelligence Agent

KrishiRakshak is an advanced, multilingual, multimodal agricultural assistant designed to bridge information asymmetry for smallholder and rural farmers. Built for Farmers, it combines real-time data ingestion, RAG document retrieval, and a transparent financial decision engine to help farmers grow better, sell smarter, and lose less.

---

## 🚀 Key Features

* **🗣️ Multilingual Voice & Multimodal Interface:** Built with a clean, high-contrast White and Light Green UI, supporting voice queries in regional dialects (Telugu, Hindi, Tamil, Kannada, English) and instant crop disease scanning via camera/photo upload.
* **🌱 Pre-Harvest ("Grow Better"):** Features crop health monitoring, instant AI disease diagnosis (e.g., Early Blight detection with confidence scores), daily irrigation/fertilizer schedules, and a vector database (RAG) matching farmers with eligible **Government Schemes & Subsidies** (e.g., PM-Kisan, SMAM).
* **🌾 Harvest ("Sell Smarter"):** Displays live wholesale Mandi price comparisons, verified direct buyers, community crop aggregation progress bars (village pooling for bulk price boosts), and local transportation logistics matching.
* **📦 Post-Harvest ("Lose Less" — Hero Pitch):** A multi-factor Explainable AI Decision Engine that analyzes crop type, volume, ambient temperature/humidity, spoilage probability, holding costs, and price forecasts to output a definitive action:
  * `SELL NOW` | `STORE FOR 2 DAYS` | `PROCESS` | `POOL WITH FARMERS`
  * **Crucially includes the "WHY?":** Provides a transparent, plain-language financial breakdown of storage costs versus expected gross price gains.

---

## 🛠️ Technology Stack

* **Frontend:** React / Next.js (Modern web dashboard styled with Tailwind CSS, optimized for desktop and mobile web viewports).
* **Backend:** Python FastAPI (Lightning-fast API routing and multipart file handling).
* **AI Brain:** LangGraph & Google Gemini (Multimodal reasoning, native multilingual support, and real-time live search grounding).
* **Voice AI:** Sarvam AI API for ultra-realistic local Indian dialect TTS (Text-to-Speech) and STT.
* **Offline AI:** Local Llama 3 (via Ollama) for resilient logistics and cost estimations.
* **Memory & RAG:** ChromaDB and HuggingFace Embeddings (`all-MiniLM-L6-v2`) for local policy/scheme document retrieval.
* **Live Ingestion:** OpenWeatherMap API and Data.gov.in Mandi prices for real-time agricultural risk assessment.

---

## 📂 Project Architecture

```text
KrishiRakshak_App/
│
├── BACKEND/                  # Python FastAPI & AI Agent
│   ├── main.py               # API Server & Endpoints (/api/ask, /api/decision)
│   ├── agent.py              # LangGraph + Gemini Agent & Tools
│   ├── rag_setup.py          # ChromaDB Vector Store & PDF Loader
│   ├── verify_rag.py         # RAG Source Verification Script
│   ├── offline_ai/           # Local Llama 3 setup & Offline CNN Models
│   ├── data/                 # Government schemes & agricultural PDFs
│   └── requirements.txt      # Python dependencies
│
└── FRONTEND/                 # Next.js / React Web Application
    ├── app/                  # App router pages & layouts
    ├── components/           # Modular UI widgets (Cards, Chips, Chat bubbles, Dashboards)
    └── public/               # Static assets
```