# src/llm_service/llm_handler.py
from llama_index.llms.ollama import Ollama
from config import config
from llama_index.core import Settings # ADD THIS
from llm_service.embedding_handler import embedding_handler 



class LLMHandler:
    def __init__(self):
        self.llm = Ollama(model=config.LLM_MODEL, base_url=config.LLM_HOST, request_timeout=config.LLM_TIMEOUT ) #  or use HuggingFaceLLM, etc.
        
    def generate_text(self, prompt):
        """
        Generates text using the LLM.
        """
        response = self.llm.complete(prompt)
        return response.text

    # Add methods for streaming responses, handling errors, etc.

llm_handler = LLMHandler()

def init_llm():
    """Initializes the LLM and configures LlamaIndex settings."""
    Settings.llm = llm_handler.llm # assign LLM
    Settings.embed_model = embedding_handler.embedding_model # assign embedding model
    return True