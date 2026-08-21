# 🌾 KrishiRakshak: AI-Powered Farm Intelligence Agent

KrishiRakshak is an advanced, multilingual, multimodal agricultural assistant designed to bridge information asymmetry for smallholder and rural farmers. Built for the Smart India Hackathon (SIH), it combines real-time data ingestion, RAG document retrieval, and a transparent financial decision engine to help farmers grow better, sell smarter, and lose less.

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
* **AI Brain:** LangGraph & Google Gemini (Multimodal reasoning and native multilingual support).
* **Memory & RAG:** ChromaDB and HuggingFace Embeddings (`all-MiniLM-L6-v2`) for local policy/scheme document retrieval.
* **Live Ingestion:** OpenWeatherMap API for real-time agricultural meteorological risk assessment.

---

## 📂 Project Architecture

```text
KrishiRakshak_App/
│
├── backend/                  # Python FastAPI & AI Agent
│   ├── main.py               # API Server & Endpoints (/api/ask)
│   ├── agent.py              # LangGraph + Gemini Agent & Tools
│   ├── rag_setup.py          # ChromaDB Vector Store & PDF Loader
│   ├── verify_rag.py         # RAG Source Verification Script
│   ├── data/                 # Government schemes & agricultural PDFs
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # Next.js / React Web Application
    ├── app/                  # App router pages & layouts
    ├── components/           # Modular UI widgets (Cards, Chips, Chat bubbles)
    └── public/               # Static assets