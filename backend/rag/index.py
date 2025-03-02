# backend/rag/index.py
# doc: https://docs.llamaindex.ai/en/stable/api_reference/indices/

import os
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    SimpleDirectoryReader,
)
import chromadb
from llama_index.vector_stores.chroma import ChromaVectorStore
from backend.config import settings
from backend.rag.llm import init_llm

# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(path=settings.VECTOR_DB_PATH)

# Get (or create) a collection for our artifacts.
# The collection name can be anything, here we use "artifacts_collection"
chroma_collection = chroma_client.get_or_create_collection("artifacts_collection")

# Initialize ChromaVectorStore with the collection object.
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

# Initialize the LLM and Embedding settings (this sets global settings for LlamaIndex)
init_llm()

# Create a StorageContext using the vector store.
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Create the vector index from the vector store.
vector_index = VectorStoreIndex.from_vector_store(
    vector_store,
    storage_context=storage_context
)

# Create query engine (default)
query_engine = vector_index.as_query_engine()

def reset():
    print("chroma db: count before", chroma_collection.count())
    ret = chroma_collection.get()
    for meta in ret['metadatas']:
        print("document_id", meta['document_id'])
        
    for docid in ret['ids']:
        print("deleting", docid)
        chroma_collection.delete(ids=[docid,])
    print("chroma db: count after", chroma_collection.count())

