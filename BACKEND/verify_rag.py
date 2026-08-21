import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

def verify_rag():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_folder = os.path.join(base_dir, "chroma_db")
    
    print(f"Checking database at: {db_folder}")
    
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma(persist_directory=db_folder, embedding_function=embeddings)
    
    # Run a test search using a keyword that SHOULD be in your agriculture PDF
    test_query = "fertilizer" 
    docs = db.similarity_search(test_query, k=1)
    
    if docs:
        print("\n✅ RAG VERIFIED! It successfully retrieved real content:")
        print("-" * 50)
        print(docs[0].page_content)
        print("-" * 50)
    else:
        print("\n❌ Error: No content found. Check if your PDFs are in the 'data' folder.")

if __name__ == "__main__":
    verify_rag()