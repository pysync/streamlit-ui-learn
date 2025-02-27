import streamlit as st
from llama_index.core.chat_engine import CondenseQuestionChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llm_service.llm_handler import llm_handler
from data_management.context_manager import context_manager


class ChatInterface:
    def __init__(self, chat_title="Project Chat"):
        self.chat_title = chat_title
        self.llm = llm_handler.llm
        self.memory = ChatMemoryBuffer.from_defaults(token_limit=1500)
        self.chat_engine = self.create_chat_engine()

    def create_chat_engine(self):
        """Creates a chat engine using the LLM and the vector database."""
        if context_manager.query_engine:
            return CondenseQuestionChatEngine.from_defaults(
                llm=self.llm,
                condense_question_llm=self.llm,
                memory=self.memory,
                query_engine=context_manager.query_engine,
            )
        else:
            st.warning("Please upload documents to initialize the vector database before using chat.")
            return None # or return a dummy chat engine that displays an error message

    def display(self):
        """Displays the chat interface in Streamlit."""
        st.subheader(self.chat_title)

        if "messages" not in st.session_state:
            st.session_state.messages = []

        # Document Selection UI
        uploaded_files = context_manager.uploaded_files
        if not uploaded_files:
            st.info("Please upload documents to start the chat.")
            return

        # Create a dictionary to store the selection state
        if "selected_files" not in st.session_state:
            st.session_state.selected_files = {file['filename']: True for file in uploaded_files}

        # Display checkboxes for each uploaded document
        st.write("Select documents to include in the context:")
        for file in uploaded_files:
            filename = file['filename']
            st.session_state.selected_files[filename] = st.checkbox(
                filename, 
                value=st.session_state.selected_files.get(filename), 
                key=filename
            )

        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        if prompt := st.chat_input("Ask me anything about your project..."):

            # Build the prompt with the selected documents
            selected_files = [file['filename'] for file in uploaded_files if st.session_state.selected_files.get(file['filename'])]
            if selected_files:
                file_names_to_prompt = ", ".join(selected_files)
                prompt = f"With documents: {file_names_to_prompt}, {prompt}"
                st.write("FINAL PROMPT IS: " + prompt)

            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)

            if self.chat_engine:
                with st.chat_message("assistant"):
                    message_placeholder = st.empty()
                    full_response = ""

                    try:
                        response = self.chat_engine.chat(prompt)  # get response from memory chat
                        full_response = response.response
                    except Exception as e:
                        full_response = f"Error during chat: {e}"
                        st.error(full_response)

                    message_placeholder.markdown(full_response + "▌") # typing effact
                    message_placeholder.markdown(full_response) # save to session

                st.session_state.messages.append({"role": "assistant", "content": full_response})

            else:
                st.warning("Chat engine not initialized.  Please upload documents first.")