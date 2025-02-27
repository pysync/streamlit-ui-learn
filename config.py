# config.py
import os

class Config:
    LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-r1")  # Default LLM model
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "deepseek-r1")
    LLM_HOST =  os.getenv("LLM_HOST", "http://10.1.11.60:11434")
    LLM_TIMEOUT =  float(os.getenv("LLM_TIMEOUT", 300.0))
    DEBUG =  os.getenv("DEBUG", "False").lower() == "true" 
    
    VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./vector_db")
    OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./output")
    # Add other configurations as needed


config = Config()