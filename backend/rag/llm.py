# backend/rag/llm.py

from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.core import Settings # ADD THIS
from backend.config import settings as config

class EmbeddingHandler:
    def __init__(self):
        self.embedding_model = OllamaEmbedding(
            model_name=config.EMBEDDING_MODEL, 
            base_url=config.LLM_HOST, 
            request_timeout=config.LLM_TIMEOUT
        )
        
    def get_embeddings(self, text_list):
        """
        Generates embeddings for a list of texts.
        """
        embeddings = self.embedding_model.get_embeddings(text_list)
        return embeddings


class LLMHandler:
    def __init__(self):
        self.llm = Ollama(
            model=config.LLM_MODEL, 
            base_url=config.LLM_HOST, 
            request_timeout=config.LLM_TIMEOUT 
        ) #  or use HuggingFaceLLM, etc.
        
    def generate_text(self, prompt):
        """
        Generates text using the LLM.
        """
        response = self.llm.complete(prompt)
        return response.text

    # Add methods for streaming responses, handling errors, etc.

embedding_handler = EmbeddingHandler()
llm_handler = LLMHandler()

def init_llm():
    """Initializes the LLM and configures LlamaIndex settings."""
    Settings.llm = llm_handler.llm # assign LLM
    Settings.embed_model = embedding_handler.embedding_model # assign embedding model
    return (llm_handler.llm, embedding_handler.embedding_model)