# backend/config.py
from pydantic_settings import BaseSettings
from sqlmodel import create_engine, SQLModel


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./database.db"
   
    LLM_MODEL: str = "deepseek-r1"
    EMBEDDING_MODEL: str = "deepseek-r1"
    LLM_HOST: str = "http://10.1.11.60:11434"
    LLM_TIMEOUT: float = 300.0
    DEBUG: bool =  False
    VECTOR_DB_PATH: str  = "./chroma_db"
    
    
settings = Settings()

# Rename 'engine' to 'db_engine' for clarity
db_engine = create_engine(settings.DATABASE_URL, echo=False)

def init_db():
    # Add this line to force recreate tables
    SQLModel.metadata.drop_all(db_engine)
    SQLModel.metadata.create_all(db_engine)
