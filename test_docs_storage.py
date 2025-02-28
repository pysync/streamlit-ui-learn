import os
import certifi
os.environ['SSL_CERT_FILE'] = certifi.where()


OLLAMA_MODEL = "deepseek-r1"  # Or any other model you have in Ollama
EMBEDDING_MODEL = "deepseek-r1" # Or any other embedding model you have in Ollama
OLLAMA_HOST = "http://10.1.11.60:11434"
OLLAMA_TIMEOUT = 300.0


from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding

from llama_index.core import (
    Settings,
    Document, 
    VectorStoreIndex,
    StorageContext,
    SimpleDirectoryReader,
)

# create llm client
llm = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_HOST, request_timeout=OLLAMA_TIMEOUT)
embed_model = OllamaEmbedding(model_name=OLLAMA_MODEL, base_url=OLLAMA_HOST, request_timeout=OLLAMA_TIMEOUT)

# setting to use as global
Settings.embed_model = embed_model
Settings.llm = llm

# Using SimpleDirectoryReader to read from a directory
documents = SimpleDirectoryReader("data").load_data()
for doc in documents:
    print(doc.metadata)
    print(doc.id_)


import chromadb
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.chroma import ChromaVectorStore

# initialize client, setting path to save data
db = chromadb.PersistentClient(path="./chroma_db")
# create collection
chroma_collection = db.get_or_create_collection("quickstart")

# assign chroma as the vector_store to the context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# create your index
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)

# create a query engine and query
query_engine = index.as_query_engine()
response = query_engine.query("Bác Hồ là ai?")
print(response)