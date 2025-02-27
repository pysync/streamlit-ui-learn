import os
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.node_parser import SentenceSplitter
from config import config
from llm_service.embedding_handler import embedding_handler
from llama_index.core import Settings

class VectorDatabase:
    def __init__(self, persist_dir=config.VECTOR_DB_PATH):
        self.persist_dir = persist_dir
        self.index = None
        self.is_loaded = False
        self.embed_model = embedding_handler
        self.settings = Settings #add settings

    def load_data(self, directory_path):
        """Loads data from a directory and creates a VectorStoreIndex."""
        documents = SimpleDirectoryReader(input_dir=directory_path).load_data()
        text_splitter = SentenceSplitter(chunk_size=512, chunk_overlap=20)
        nodes = text_splitter.get_nodes_from_documents(documents)
        self.index = VectorStoreIndex(nodes, embed_model=self.embed_model.embedding_model)
        self.is_loaded = True

    def create_index_from_documents(self, documents):
       
        self.index = VectorStoreIndex.from_documents(documents)
        self.is_loaded = True

    def persist_index(self):
        """Persists the VectorStoreIndex to disk."""
        if self.index:
            self.index.storage_context.persist(persist_dir=self.persist_dir)
            print(f"VectorStoreIndex persisted to {self.persist_dir}")
        else:
            print("No index to persist.")

    def load_index(self):
        """Loads the VectorStoreIndex from disk."""
        try:
            # rebuild storage context
            storage_context = StorageContext.from_defaults(persist_dir=self.persist_dir)
            # load index
            self.index = load_index_from_storage(storage_context)
            self.is_loaded = True
            print(f"VectorStoreIndex loaded from {self.persist_dir}")
        except FileNotFoundError:
            print(f"No existing VectorStoreIndex found at {self.persist_dir}. A new one will be created.")
            self.index = None
            self.is_loaded = False

    def as_query_engine(self):
        """Returns the VectorStoreIndex as a query engine."""
        if self.index:
            return self.index.as_query_engine()
        else:
            print("Index not loaded. Please load or create the index first.")
            return None


vector_db = VectorDatabase()
vector_db.load_index() # Attempt to load on startup