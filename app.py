import streamlit as st
from data_management.context_manager import context_manager
from data_management.vector_database import vector_db
from data_management.data_loader import load_data
from llama_index.core import Document
from config import config
from llm_service.llm_handler import init_llm
from components.chat_interface import ChatInterface
import os

def main():
    st.set_page_config(page_title="SDLC Tool")
    st.sidebar.title("SDLC Tool")

    # Init debug state, must init before load sub page.
    if 'debug' not in st.session_state:
        st.session_state.debug = False

    # Init LLM handler first
    if 'llm_initialized' not in st.session_state:  # Check if LLM is initialized
        if init_llm():
            st.sidebar.success("LLM model loaded.")
            st.session_state.llm_initialized = True
        else:
            st.sidebar.error("LLM model failed to load.")
            st.stop()  # Prevent further execution

    # File Upload
    uploaded_files = st.sidebar.file_uploader("Upload Documents", accept_multiple_files=True)

    if uploaded_files:
        # Check if the uploaded files are new
        if 'uploaded_file_names' not in st.session_state or set(f.name for f in uploaded_files) != set(st.session_state.uploaded_file_names):
            st.session_state.uploaded_file_names = [f.name for f in uploaded_files]  # store the names
            st.session_state.documents_loaded = False # reset state
            progress_bar = st.sidebar.progress(0)  # Initialize progress bar
            status_text = st.sidebar.empty()
            with st.spinner("Loading data..."):
                status_text.text("Loading data...")
                documents = load_data(uploaded_files)
                progress_bar.progress(10)

                if documents:
                    # current this step very slow, need to optimize
                    status_text.text("Creating index from docs...")
                    vector_db.create_index_from_documents(documents)  # Init vector db

                    progress_bar.progress(60)
                    status_text.text("Persisting index...")
                    vector_db.persist_index()
                    progress_bar.progress(80)
                    status_text.text("Creating query engine...")
                    context_manager.query_engine = vector_db.as_query_engine()
                    st.session_state.documents_loaded = True  # set status to prevent re-init
                    progress_bar.progress(90)
                    for document in documents:
                        context_manager.add_uploaded_file(document.metadata["filename"], document.text)  # load to context for chat
                    progress_bar.progress(100)
                    st.sidebar.success("Files uploaded and processed.")
                    st.session_state.chat_engine = ChatInterface() # Re-init chat engine

                else:
                    progress_bar.progress(0)
                    status_text.empty()
                    st.sidebar.warning("No documents were able to be processed. Please check the file formats and contents.")
                    st.session_state.chat_engine = None
        else:
            #Uploaded files is not change, just load message
            if 'chat_engine' not in st.session_state:
                st.session_state.chat_engine = ChatInterface()
            st.info("Documents not changed, skip load.")
            st.session_state.documents_loaded = True
    else:
        st.session_state.documents_loaded = False

    # Load context on startup
    context_manager.load_context_from_file()
    st.sidebar.success("Project context loaded.")

    # Navigation (Streamlit pages)
    pages = {
        "Project Overview": "pages/0_Overview_SLC.py",
        "Requirements Design (SRS)": "pages/1_Requirements_Design.py",
        "Basic Design": "pages/2_Basic_Design.py",
        "Detail Design": "pages/3_Detail_Design.py",
        "Settings": "pages/5_Settings.py",
        "About": "pages/6_About.py"
    }

    selected_page = st.sidebar.selectbox("Select Page", list(pages.keys()))

    # Load the selected page using Streamlit's page mechanism
    if selected_page:
        __import__(pages[selected_page].replace("/", ".")[:-3])

    # Save context on exit (optional - use a button for manual saving)
    if st.sidebar.button("Save Project Context"):
        context_manager.save_context_to_file()
        st.sidebar.success("Project context saved.")

    # Display the chat interface
    if 'chat_engine' in st.session_state and st.session_state.documents_loaded:
        st.session_state.chat_engine.display()
    else:
        st.info("Please upload and process documents to use the chat interface.")


if __name__ == "__main__":
    main()