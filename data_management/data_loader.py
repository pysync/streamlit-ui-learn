# data_management/data_loader.py
import os
from llama_index.core import SimpleDirectoryReader
#from utils.file_utils import read_file_content #REMOVE
from llama_index.core import Document
import io

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

    documents = SimpleDirectoryReader(input_files=file_paths).load_data()
    # Add the filename to the metadata of each document
    for i, doc in enumerate(documents):
      doc.metadata["filename"] = uploaded_files[i].name

    return documents