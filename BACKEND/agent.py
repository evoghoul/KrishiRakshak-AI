import os
import warnings
import requests

# Hide the harmless LangGraph warning for a clean presentation terminal
warnings.filterwarnings("ignore", category=DeprecationWarning)

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import Tool
from langgraph.prebuilt import create_react_agent
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# NEW IMPORT: Required to pass multimodal (image + text) messages to Gemini
from langchain_core.messages import HumanMessage

# 1. Paste your Google AI Studio API key here
os.environ["GOOGLE_API_KEY"] = "AQ.Ab8RN6KXSwb-4KXSL8KuOmNrGOrGH3P34BBUm-sqI0Gg_vo2UA"

# 2. Paste your OpenWeather API key here
OPENWEATHER_API_KEY = "6d1b49b20cbc1bab5e041db96acebe7e"

# Initialize Gemini without the temperature parameter
llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash")

# ==========================================
# TOOL 1: Government Scheme & Crop Retriever (RAG)
# ==========================================
def check_gov_schemes(query: str) -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_folder = os.path.join(base_dir, "chroma_db")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma(persist_directory=db_folder, embedding_function=embeddings)
    docs = db.similarity_search(query, k=3)
    return "\n".join([doc.page_content for doc in docs])

scheme_tool = Tool(
    name="AgriKnowledgeBase",
    func=check_gov_schemes,
    description="Use this for looking up farming practices and government schemes from local documents."
)

# ==========================================
# TOOL 2: Live Real-Time Weather API
# ==========================================
def get_live_weather(location: str) -> str:
    """Fetches live meteorological data from OpenWeatherMap servers."""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            temp = data['main']['temp']
            humidity = data['main']['humidity']
            desc = data['weather'][0]['description']
            return f"Live Weather in {location}: {temp}°C, Humidity: {humidity}%, Condition: {desc}."
        else:
            return f"Could not find live weather for {location}. Please check city spelling."
    except Exception as e:
        return f"Error connecting to weather service: {str(e)}"

weather_tool = Tool(
    name="LiveWeatherCheck",
    func=get_live_weather,
    description="Use this tool to fetch live weather, temperature, and humidity for any location."
)

# ==========================================
# TOOL 3: Market Analyzer
# ==========================================
def get_market_advice(query: str) -> str:
    return "Wholesale Market price: ₹1800/quintal. Cold storage cost: ₹50/day. Recommendation: STORE for 3 days."

market_tool = Tool(
    name="MarketAnalyzer",
    func=get_market_advice,
    description="Use this for market price and storage advice."
)

# ==========================================
# AGENT INITIALIZATION
# ==========================================
tools = [scheme_tool, weather_tool, market_tool]
krishirakshak_agent = create_react_agent(model=llm, tools=tools)

# UPGRADED FUNCTION: Now accepts an optional image_base64 parameter
def get_farmer_advice(query: str, image_base64: str = None) -> str:
    prompt = f"""
    You are KrishiRakshak, an intelligent assistant for Indian farmers. A farmer asks: '{query}'
    1. Detect the language of the query and reply strictly in that same language or dialect.
    2. If an image is provided, diagnose the crop health/disease and suggest remedies.
    3. Use your tools (LiveWeatherCheck, AgriKnowledgeBase, MarketAnalyzer) to gather real facts.
    4. Keep it simple and advise the farmer on what buttons to touch on screen.
    """
    
    # Structure multimodal content for Gemini
    message_content = [{"type": "text", "text": prompt}]
    
    # If the frontend passes a photo, append it to the message payload
    if image_base64:
        message_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}
        })
        
    # Send the combined text (+ optional image) to the agent
    response = krishirakshak_agent.invoke({"messages": [HumanMessage(content=message_content)]})
    
    # Extract clean text from content blocks
    raw_content = response["messages"][-1].content
    if isinstance(raw_content, list):
        return "".join([block.get("text", "") if isinstance(block, dict) else str(block) for block in raw_content])
    return str(raw_content)

# Test Run
if __name__ == "__main__":
    print("Testing Real-Time KrishiRakshak Agent...\n")
    
    # Test query targeting the live weather tool
    test_q = "What is the live weather in Vadlamudi right now, and should I store my crops?"
    print(f"Farmer Query: {test_q}\n")
    
    try:
        print("AI Response:\n", get_farmer_advice(test_q))
    except Exception as e:
        print(f"Error running agent: {e}")