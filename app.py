# src/main.py
import streamlit as st
from data_management.context_manager import context_manager
from data_management.vector_database import vector_db
from data_management.data_loader import load_data
from llama_index.core import Document
from config import config
from llm_service.llm_handler import init_llm
import os

from slc_tabs.SLCChat import render as SLCChat 
from slc_tabs.SLCBD import render as SLCBD 
from slc_tabs.SLCRD import render as SLCRD 
from slc_tabs.SLCSettings import render as SLCSettings 
from slc_tabs.SLCAbout import render as SLCAbout 

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

                else:
                    progress_bar.progress(0)
                    status_text.empty()
                    st.sidebar.warning("No documents were able to be processed. Please check the file formats and contents.")
        else:
            #Uploaded files is not change, just load message
            st.info("Documents not changed, skip load.")
            st.session_state.documents_loaded = True
    else:
         st.session_state.documents_loaded = False

    # Load context on startup
    context_manager.load_context_from_file()
    st.sidebar.success("Project context loaded.")

    # Create tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs(["Overview", "Requirements", "Basic Design", "Settings", "About"])

    # Load content for each tab
    with tab1:
        SLCChat()
        
    with tab2:
        SLCRD()

    with tab3:
        SLCBD()

    with tab4:
        SLCSettings()

    with tab5:
        SLCAbout()

    # Save context on exit (optional - use a button for manual saving)
    if st.sidebar.button("Save Project Context"):
        context_manager.save_context_to_file()
        st.sidebar.success("Project context saved.")

if __name__ == "__main__":
    main()