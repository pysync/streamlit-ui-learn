import json
from data_management.vector_database import vector_db
from llm_service.llm_handler import llm_handler
from llama_index.core import Document

class ContextManager:
    def __init__(self):
        self.project_data = {}  # Store all project-related data (SRS, BD, DD, etc.)
        self.uploaded_files = []
        self.query_engine = vector_db.as_query_engine()

    def add_uploaded_file(self, filename, content):
        self.uploaded_files.append({"filename": filename, "content": content})
        self.update_vector_db(content)  # Update vector DB when files are uploaded

    def update_project_data(self, tab_name, data):
        """Updates the project data for a specific tab."""
        self.project_data[tab_name] = data
        # Trigger event to notify other tabs (see EventBus below)
        event_bus.publish(f"{tab_name}_updated", data)

    def get_project_data(self, tab_name):
        """Retrieves the project data for a specific tab."""
        return self.project_data.get(tab_name, None)

    def clear_project_data(self):
        """Clears all project data."""
        self.project_data = {}
        self.uploaded_files = []

    def save_context_to_file(self, filename="project_context.json"):
        """Saves the current project context to a JSON file."""
        with open(filename, "w") as f:
            json.dump(self.project_data, f) # store only project data

    def load_context_from_file(self, filename="project_context.json"):
        """Loads the project context from a JSON file."""
        try:
            with open(filename, "r") as f:
                self.project_data = json.load(f)
        except FileNotFoundError:
            print("Context file not found. Starting with a fresh context.")
            self.project_data = {} # reset data if not exists
        return self.project_data

    def query_llm(self, query):
         response = llm_handler.generate_text(query)
         return response

    def update_vector_db(self, text):
        """
        Updates the vector database with new text content.
        """
        new_document = Document(text=text)
        vector_db.create_index_from_documents([new_document])
        vector_db.persist_index() # Persist after updating
        self.query_engine = vector_db.as_query_engine()  # Refresh query engine

    def query_vector_db(self, query):
        """
        Queries the vector database with a given query.
        """
        if self.query_engine:
            response = self.query_engine.query(query)
            return response.response
        else:
            return "Vector database not initialized. Please upload documents first."

context_manager = ContextManager()