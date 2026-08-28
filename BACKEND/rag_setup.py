import os
import warnings
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# Hide the harmless LangChain warning for a clean terminal output
warnings.filterwarnings("ignore", category=DeprecationWarning)

def create_vector_db():
    # Force the script to look in its exact current directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_folder = os.path.join(base_dir, "data")
    db_folder = os.path.join(base_dir, "chroma_db")

    # 1. Safety Check: Ensure data directory exists
    if not os.path.exists(data_folder):
        print(f"Error: I am looking for a folder exactly here: {data_folder}")
        print("Please create the 'data' folder and add a PDF.")
        return

    # 2. Load agricultural PDFs
    loader = PyPDFDirectoryLoader(data_folder)
    documents = loader.load()
    
    # 3. Safety Check: Ensure a PDF is actually inside
    if not documents:
        print("Error: The 'data' folder exists, but no PDFs were found inside it.")
        return
        
    print(f"Loaded {len(documents)} pages. Splitting text...")
    
    # 4. Split text into manageable chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    
    print("Downloading AI Embeddings Model... (This takes a minute on the first run)")
    
    # 5. Create Embeddings & Store in VectorDB
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # 6. Initialize Chroma (Automatically saves to backend/chroma_db)
    vector_db = Chroma.from_documents(
        documents=docs, 
        embedding=embeddings, 
        persist_directory=db_folder
    )
    
    print("Vector DB Setup Complete! Chroma DB is ready for KrishiRakshak.")

if __name__ == "__main__":
    create_vector_db()