import streamlit as st
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext
)
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core import Settings
import os

# --- Constants ---
OLLAMA_MODEL = "deepseek-r1"  # Or any other model you have in Ollama
EMBEDDING_MODEL = "deepseek-r1" # Or any other embedding model you have in Ollama
OLLAMA_HOST = "http://10.1.11.60:11434"

# --- Helper Functions ---
def load_data(uploaded_files):
    """Loads data from uploaded files."""
    if not uploaded_files:
        return None

    # Create a temporary directory to save the uploaded files
    temp_dir = "temp_files"
    os.makedirs(temp_dir, exist_ok=True)

    # Save the uploaded files to the temporary directory
    file_paths = []
    for uploaded_file in uploaded_files:
        file_path = os.path.join(temp_dir, uploaded_file.name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        file_paths.append(file_path)


    # Load data using SimpleDirectoryReader (automatically handles multiple file types)
    documents = SimpleDirectoryReader(input_files=file_paths).load_data()
    return documents


def build_index(documents):
    """Builds a vector store index from the documents."""
    if not documents:
        return None

    # Define the LLM
    llm = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_HOST)

    # Define the embedding model
    embed_model = OllamaEmbedding(model_name=EMBEDDING_MODEL, base_url=OLLAMA_HOST)

    #Configure LlamaIndex Settings
    Settings.llm = llm
    Settings.embed_model = embed_model

    # Build the index
    index = VectorStoreIndex.from_documents(documents)
    return index


def init_chat_engine(index):
    """Initializes the chat engine with memory."""
    if not index:
        return None

    # Configure chat engine with memory
    memory = ChatMemoryBuffer.from_defaults(token_limit=1500)
    chat_engine = index.as_chat_engine(
        chat_mode="context",
        memory=memory,
        system_prompt="You are a helpful assistant that answers questions based on the context provided.",
    )
    return chat_engine


# --- Streamlit UI ---
st.title("RAG Chatbot with Ollama and LlamaIndex")

# Sidebar for file upload
st.sidebar.header("Upload Documents")
uploaded_files = st.sidebar.file_uploader(
    "Upload your files (docx, xls, etc.)", accept_multiple_files=True
)

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []


# --- Main App Logic ---
if uploaded_files:
    # Load data and build index (expensive operation, do only when files change)
    with st.spinner("Loading data and building index..."):
        documents = load_data(uploaded_files)
        index = build_index(documents)
        chat_engine = init_chat_engine(index)

    if chat_engine:
        # Display chat messages from history
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        # Chat input
        prompt = st.chat_input("Ask me anything about the documents:")
        if prompt:
            # Add user message to chat history
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)

            # Get response from the chat engine
            with st.spinner("Generating response..."):
                response = chat_engine.chat(prompt)
                response_text = str(response)  # Convert to string

            # Add assistant message to chat history
            st.session_state.messages.append({"role": "assistant", "content": response_text})
            with st.chat_message("assistant"):
                st.markdown(response_text)
    else:
        st.error("Failed to initialize chat engine.  Check your Ollama setup and try again.")


else:
    st.info("Please upload documents to start the chat.")