# /llm_service/embedding_handler.py
from llama_index.embeddings.ollama import OllamaEmbedding
from config import config

class EmbeddingHandler:
    def __init__(self):
        self.embedding_model = OllamaEmbedding(model_name=config.EMBEDDING_MODEL, base_url=config.LLM_HOST, request_timeout=config.LLM_TIMEOUT)
        
    def get_embeddings(self, text_list):
        """
        Generates embeddings for a list of texts.
        """
        embeddings = self.embedding_model.get_embeddings(text_list)
        return embeddings

embedding_handler = EmbeddingHandler()
