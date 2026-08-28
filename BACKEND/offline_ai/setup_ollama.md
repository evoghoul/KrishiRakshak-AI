# Offline Llama 3 Setup Guide

To replace the cloud-based Gemini API, KrishiRakshak now uses **Ollama** running **Llama 3** locally for all reasoning, mathematical calculation, and diagnosis generation.

## Prerequisites
- **RAM**: Minimum 8GB (16GB+ recommended).
- **GPU**: An NVIDIA GPU (with CUDA) or Apple Silicon (M1/M2/M3) is highly recommended for fast inference. CPU-only inference will be very slow.

## Installation Steps

1. **Install Ollama**
   - Go to [ollama.com](https://ollama.com/)
   - Download and install the version for your OS (Windows, macOS, or Linux).
   - If you are on Linux, you can run: `curl -fsSL https://ollama.com/install.sh | sh`

2. **Pull the Llama 3 Model**
   - Open your terminal or command prompt.
   - Run the following command to download the 8B parameter Llama 3 model (approx 4.7 GB):
     ```bash
     ollama run llama3
     ```
   - Once it finishes downloading, you will be dropped into a chat prompt. You can type `/bye` to exit.

3. **Verify the Ollama Server**
   - Ollama automatically starts a local server. Verify it's running by visiting `http://localhost:11434` in your browser. You should see `Ollama is running`.

## How KrishiRakshak Connects to Ollama
The `agent.py` and `main.py` files have been updated to make standard HTTP `POST` requests to `http://localhost:11434/api/generate`.

No API keys are required. Ensure the Ollama application is running in the background whenever you start the FastAPI backend server.
