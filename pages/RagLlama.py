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
import pandas as pd
from streamlit_mermaid import st_mermaid
import json
import re

# --- Constants ---
OLLAMA_MODEL = "deepseek-r1"  # Or any other model you have in Ollama
EMBEDDING_MODEL = "deepseek-r1" # Or any other embedding model you have in Ollama
OLLAMA_HOST = "http://10.1.11.60:11434"
OLLAMA_TIMEOUT = 300.0 

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
    llm = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_HOST, request_timeout=OLLAMA_TIMEOUT)

    # Define the embedding model
    embed_model = OllamaEmbedding(model_name=EMBEDDING_MODEL, base_url=OLLAMA_HOST, request_timeout=OLLAMA_TIMEOUT)

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

def extract_json(text):
    """
    Extracts valid JSON from a string.

    Args:
        text (str): The string potentially containing JSON.

    Returns:
        dict or list or None: The extracted JSON object, or None if no valid JSON is found.
    """
    try:
        # Try to load the entire text as JSON first
        return json.loads(text)
    except json.JSONDecodeError as e:
        # If that fails, try to find JSON within the text
        start = text.find('[')
        if start == -1:
            start = text.find('{')  # Check for object
        if start == -1:
            return None  # No JSON start found

        end = text.rfind(']')
        if end == -1:
            end = text.rfind('}')  # Check for object
        if end == -1:
            return None  # No JSON end found

        if start >= end:
          return None # Invalid start/end

        json_string = text[start:end + 1]
        try:
            return json.loads(json_string)
        except json.JSONDecodeError:
            return None  # Still couldn't parse the extracted part
    except Exception as e:
        print(f"Unexpected error during JSON extraction: {e}")
        return None  # Handle unexpected errors
    

# --- Function to Generate Screen List ---
def generate_screen_list(chat_engine):
    """Generates a screen list from the chat engine."""
    try:
        response = chat_engine.chat(
            "Generate a list of screens based on the current system context. "
            "Return a JSON array (list) of JSON objects (dictionaries).  Each JSON object should represent a screen and contain the following keys: "
            "No, Code, Module, Screen_Name, Description.  Make the 'Code' column unique, and use that Code for referent screen between context. Ensure the JSON is valid and parsable. Only return JSON, without other text."
        )

        st.write("### LLM Response (Debug):")
        st.write(response.response)  # Display the raw response
        st.write("### JSON Parse (Debug):")

        # Extract the JSON data
        screen_list_data = extract_json(response.response)

        if screen_list_data is None:
            st.error("No valid JSON found in LLM response.")
            return None

        st.json(screen_list_data)

        # Construct the DataFrame from the JSON data
        screen_list_df = pd.DataFrame(screen_list_data)

        if not isinstance(screen_list_df, pd.DataFrame):
            st.error("LLM returned data not in expected DataFrame format.")
            return None
        return screen_list_df
    except Exception as e:
        st.error(f"Error generating screen list: {e}")
        return None



def generate_db_info(chat_engine):
    """Generates a DB table list and ER diagram from the chat engine."""
    try:
        table_list_prompt = """
        You are an expert in extracting database table schemas. Your output will be used to automatically generate Entity-Relationship Diagrams.

        Given the current system context (database schema and relationships), generate a list of database tables.

        **Instructions:**

        1. Return a JSON array (list) of JSON objects (dictionaries).
        2. Each JSON object should represent a table and contain the following keys:
        - "table_name" (STRING): The name of the table.
        - "columns" (LIST of JSON objects): A list of column objects.  Each column object should have the following keys:
            - "column_name" (STRING): The name of the column.
            - "data_type" (STRING): The data type of the column (e.g., INT, VARCHAR, DATE, DECIMAL).
            - "is_primary_key" (BOOLEAN): True if the column is part of the primary key, False otherwise.
            - "is_foreign_key" (BOOLEAN): True if the column is a foreign key, False otherwise.
            - "references_table" (STRING, optional): The name of the table this column references, if it is a foreign key.  Omit this if it's not a foreign key.
            - "references_column" (STRING, optional): The name of the column in the referenced table that is references, if it is a foreign key.  Omit this if it's not a foreign key.
        3. Ensure that each table definition only has one primary key (PK) designation. If a table has a composite primary key, represent it by stating the combination of columns forms a unique identifier, not by marking multiple columns as 'PK'.
        4. When specifying data types, use only the following: integer, varchar, date, decimal, boolean. For text fields, use varchar 
        5. Table and column names must adhere to the following rules:
            -   Use only english alphanumeric characters (A-Z, a-z, 0-9) and underscores (_).
            -   Start with a letter (A-Z, a-z).
            -   Do not include spaces or special characters.
            -   Use descriptive and meaningful names.
            -   Follow a consistent casing convention (e.g., snake_case or PascalCase). We recommend snake_case (all lowercase, with words separated by underscores).
            -   Table names should be singular (e.g., "customer" instead of "customers").
            -   Avoid reserved words (e.g., "order", "user", "group").  If necessary, prefix or suffix the name (e.g., "user_account", "order_record").
            -   Keep names reasonably short (under 30 characters).
        6. In this database, all primary key columns should be named `<table_name>_id` (e.g., `customer_id` for the `customer` table).
        7. Only return JSON, without any other text.  The JSON should be a single, valid JSON array.
        8. It is absolutely critical that the entire JSON structure is returned.  Do not truncate the response or include any placeholder text like '// ... continue' or similar.  The response must be a complete and valid JSON array.

        **Example Output:**

        ```json
        [
        {
            "table_name": "CUSTOMERS",
            "columns": [
            {
                "column_name": "customer_id",
                "data_type": "INT",
                "is_primary_key": true,
                "is_foreign_key": false
            },
            {
                "column_name": "customer_name",
                "data_type": "VARCHAR",
                "is_primary_key": false,
                "is_foreign_key": false
            },
            ...
            ]
        },
        {
            "table_name": "ORDERS",
            "columns": [
            {
                "column_name": "order_id",
                "data_type": "INT",
                "is_primary_key": true,
                "is_foreign_key": false
            },
            ....
        ]
        ```

        Begin!
        """

        table_list_response = chat_engine.chat(table_list_prompt)

        st.write("### LLM Response (Table List - Debug):")
        st.write(table_list_response.response)
        st.write("### JSON Parse (Debug):")

        table_list_data = extract_json(table_list_response.response)

        if table_list_data is None:
            st.error("No valid JSON found in LLM response.")
            return None, None

        st.json(table_list_data)

        table_list_df = pd.DataFrame(table_list_data)

        if not isinstance(table_list_df, pd.DataFrame):
            st.error("LLM returned table list data not in expected DataFrame format.")
            return None, None  # Return None for both table list and ER diagram

        # Prepare the table information for the ER diagram prompt
        table_info_string = ""
        for table in table_list_data:
            table_info_string += f"\n[Table name: {table['table_name']}]\n"
            table_info_string += "Columns:\n"
            for column in table['columns']:
                references_info = ""
                if 'is_foreign_key' in column and column["is_foreign_key"]:
                    references_info = f" referencing {column['references_table']}.{column['references_column']}"
                table_info_string += f"- {column['column_name']} ({column['data_type']}"
                if 'is_primary_key' in column and column["is_primary_key"]:
                    table_info_string += ", PRIMARY KEY"
                if 'is_primary_key' in column and column["is_foreign_key"]:
                    table_info_string += f", FOREIGN KEY{references_info})"
                else:
                    table_info_string += ")"
                table_info_string += "\n"
        print(table_info_string)  # Debug

        er_diagram_prompt = f"""
            You are an expert in generating Mermaid code for Entity-Relationship Diagrams (ERDs). Your output will be directly rendered by Mermaid, so it is critical that it be correct.

            Given the following database table schemas, generate a complete Mermaid erDiagram string. Ensure that the generated Mermaid code is syntactically valid and includes all tables and their relationships.

            Database Tables:

            {table_info_string}

            Instructions:

            Start the Mermaid code block with erDiagram.

            For each table, define an entity with its attributes (columns) and data types.

            Mark primary keys with PK and foreign keys with FK. Explicitly state the referenced table for foreign keys.

            Define relationships between tables using the correct Mermaid syntax to represent cardinality (one-to-many, many-to-many, etc.). Use descriptive relationship labels (e.g., "places", "contains", "categorizes").
            Represent relationships between tables using Mermaid's relationship syntax (e.g., ||--o{{ for a one-to-many relationship). Clearly label the relationships (e.g., CUSTOMER ||--o{{ ORDER : places). For foreign keys, always include FK references <TABLE>.<COLUMN>.
            
            Resolve many-to-many relationships with junction tables if necessary (e.g., ORDER_ITEMS between ORDERS and PRODUCTS).
            Ensure there is a one-to-many relationship defined between e.g., CATEGORIES and PRODUCTS and label it something like "categorizes".
               
            Return only the Mermaid code string, do NOT wrap the code in markdown or other formatting. Return it as one single string.

            Here is an example of a complete, valid Mermaid ER diagram:
            ```plaintext
           erDiagram
                CUSTOMER {{
                    int customer_id PK
                    string customer_name
                    string customer_email
                }}

                ORDER {{
                    int order_id PK
                    int customer_id FK
                    date order_date
                }}

                CUSTOMER ||--o{{ ORDER : places
            ```
            Begin!
            """

        er_diagram_response = chat_engine.chat(er_diagram_prompt)

        # Debug output for ER diagram response
        st.write("### LLM Response (ER Diagram - Debug):")
        st.write(er_diagram_response.response)

        er_diagram_code = er_diagram_response.response

        return table_list_df, er_diagram_code
    except Exception as e:
        st.error(f"Error generating DB info: {e}")
        return None, None

# --- Streamlit App ---
st.title("RAG Chatbot with Ollama and LlamaIndex")

tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs(["Chat", "Screen List", "ER Digram", "API List", "Settings", "About"])

with tab2:
    st.title("Generated Screen List")

    if 'screen_list_df' not in st.session_state:
        st.session_state.screen_list_df = None

    if st.button("Refresh Screen List"):
        if 'chat_engine' in st.session_state and st.session_state.chat_engine:
            st.session_state.screen_list_df = generate_screen_list(st.session_state.chat_engine)
        else:
            st.warning("Please upload documents and initialize the chat engine first.")

    if st.session_state.screen_list_df is not None:
        st.dataframe(st.session_state.screen_list_df)
    else:
        st.info("Click 'Refresh Screen List' to generate the screen list.")


with tab3:
    st.title("Generated DB Table and ER Digaram")

    # Initialize session state variables
    if 'table_list_df' not in st.session_state:
        st.session_state.table_list_df = None
    if 'er_diagram_code' not in st.session_state:
        st.session_state.er_diagram_code = None
    if 'table_info_string' not in st.session_state:
        st.session_state.table_info_string = None  # New state variable
    if 'table_list_data' not in st.session_state:
        st.session_state.table_list_data = None

    # Function to generate and store the ER diagram data
    def generate_er_diagram():
        if 'chat_engine' in st.session_state and st.session_state.chat_engine:
            try:
                table_list_prompt = """
                    You are an expert in extracting database table schemas. Your output will be used to automatically generate Entity-Relationship Diagrams.

                    Given the current system context (database schema and relationships), generate a list of database tables.

                    **Instructions:**

                    1. Return a JSON array (list) of JSON objects (dictionaries).
                    2. Each JSON object should represent a table and contain the following keys:
                    - "table_name" (STRING): The name of the table.
                    - "columns" (LIST of JSON objects): A list of column objects.  Each column object should have the following keys:
                        - "column_name" (STRING): The name of the column.
                        - "data_type" (STRING): The data type of the column (e.g., INT, VARCHAR, DATE, DECIMAL).
                        - "is_primary_key" (BOOLEAN): True if the column is part of the primary key, False otherwise.
                        - "is_foreign_key" (BOOLEAN): True if the column is a foreign key, False otherwise.
                        - "references_table" (STRING, optional): The name of the table this column references, if it is a foreign key.  Omit this if it's not a foreign key.
                        - "references_column" (STRING, optional): The name of the column in the referenced table that is references, if it is a foreign key.  Omit this if it's not a foreign key.
                    3. Ensure that each table definition only has one primary key (PK) designation. If a table has a composite primary key, represent it by stating the combination of columns forms a unique identifier, not by marking multiple columns as 'PK'.
                    4. When specifying data types, use only the following: integer, varchar, date, decimal, boolean. For text fields, use varchar 
                    5. Table and column names must adhere to the following rules:
                        -   Use only english alphanumeric characters (A-Z, a-z, 0-9) and underscores (_).
                        -   Start with a letter (A-Z, a-z).
                        -   Do not include spaces or special characters.
                        -   Use descriptive and meaningful names.
                        -   Follow a consistent casing convention (e.g., snake_case or PascalCase). We recommend snake_case (all lowercase, with words separated by underscores).
                        -   Table names should be singular (e.g., "customer" instead of "customers").
                        -   Avoid reserved words (e.g., "order", "user", "group").  If necessary, prefix or suffix the name (e.g., "user_account", "order_record").
                        -   Keep names reasonably short (under 30 characters).
                    6. In this database, all primary key columns should be named `<table_name>_id` (e.g., `customer_id` for the `customer` table).
                    7. Only return JSON, without any other text.  The JSON should be a single, valid JSON array.
                    8. It is absolutely critical that the entire JSON structure is returned.  Do not truncate the response or include any placeholder text like '// ... continue' or similar.  The response must be a complete and valid JSON array.

                    **Example Output:**

                    ```json
                    [
                    {
                        "table_name": "CUSTOMERS",
                        "columns": [
                        {
                            "column_name": "customer_id",
                            "data_type": "INT",
                            "is_primary_key": true,
                            "is_foreign_key": false
                        },
                        {
                            "column_name": "customer_name",
                            "data_type": "VARCHAR",
                            "is_primary_key": false,
                            "is_foreign_key": false
                        },
                        ...
                        ]
                    },
                    {
                        "table_name": "ORDERS",
                        "columns": [
                        {
                            "column_name": "order_id",
                            "data_type": "INT",
                            "is_primary_key": true,
                            "is_foreign_key": false
                        },
                        ....
                    ]
                    ```

                    Begin!
                    """
                table_list_response = st.session_state.chat_engine.chat(table_list_prompt)

                st.write("### LLM Response (Table List - Debug):")
                st.write(table_list_response.response)
                st.write("### JSON Parse (Debug):")

                st.session_state.table_list_data = extract_json(table_list_response.response) #save table_list_data to state

                if st.session_state.table_list_data is None:
                    st.error("No valid JSON found in LLM response.")
                    return

                st.json(st.session_state.table_list_data)

                st.session_state.table_list_df = pd.DataFrame(st.session_state.table_list_data)

                if not isinstance(st.session_state.table_list_df, pd.DataFrame):
                    st.error("LLM returned table list data not in expected DataFrame format.")
                    return

                # Prepare the table information for the ER diagram prompt
                st.session_state.table_info_string = ""
                for table in st.session_state.table_list_data:
                    st.session_state.table_info_string += f"\n[Table name: {table['table_name']}]\n"
                    st.session_state.table_info_string += "Columns:\n"
                    for column in table['columns']:
                        references_info = ""
                        if 'is_foreign_key' in column and column["is_foreign_key"]:
                            references_info = f" referencing {column['references_table']}.{column['references_column']}"
                        st.session_state.table_info_string += f"- {column['column_name']} ({column['data_type']}"
                        if 'is_primary_key' in column and column["is_primary_key"]:
                            st.session_state.table_info_string += ", PRIMARY KEY"
                        if 'is_foreign_key' in column and column["is_foreign_key"]:
                            st.session_state.table_info_string += f", FOREIGN KEY{references_info})"
                        else:
                            st.session_state.table_info_string += ")"
                        st.session_state.table_info_string += "\n"
                print(st.session_state.table_info_string)  # Debug


                er_diagram_prompt = f"""
                You are an expert in generating Mermaid code for Entity-Relationship Diagrams (ERDs). Your output will be directly rendered by Mermaid, so it is critical that it be correct.

                Given the following database table schemas, generate a complete Mermaid erDiagram string. Ensure that the generated Mermaid code is syntactically valid and includes all tables and their relationships.

                Database Tables:

                {st.session_state.table_info_string}

                Instructions:

                Start the Mermaid code block with erDiagram.

                For each table, define an entity with its attributes (columns) and data types.

                Mark primary keys with PK and foreign keys with FK. Explicitly state the referenced table for foreign keys.

                Define relationships between tables using the correct Mermaid syntax to represent cardinality (one-to-many, many-to-many, etc.). Use descriptive relationship labels (e.g., "places", "contains", "categorizes").
                Represent relationships between tables using Mermaid's relationship syntax (e.g., ||--o{{ for a one-to-many relationship). Clearly label the relationships (e.g., CUSTOMER ||--o{{ ORDER : places). For foreign keys, always include FK references <TABLE>.<COLUMN>.
                
                Resolve many-to-many relationships with junction tables if necessary (e.g., ORDER_ITEMS between ORDERS and PRODUCTS).
                Ensure there is a one-to-many relationship defined between e.g., CATEGORIES and PRODUCTS and label it something like "categorizes".
                   
                Return only the Mermaid code string, do NOT wrap the code in markdown or other formatting. Return it as one single string.

                Here is an example of a complete, valid Mermaid ER diagram:
                ```plaintext
               erDiagram
                    CUSTOMER {{
                        int customer_id PK
                        string customer_name
                        string customer_email
                    }}

                    ORDER {{
                        int order_id PK
                        int customer_id FK
                        date order_date
                    }}

                    CUSTOMER ||--o{{ ORDER : places
                ```
                Begin!
                """
                er_diagram_response = st.session_state.chat_engine.chat(er_diagram_prompt)

                # Debug output for ER diagram response
                st.write("### LLM Response (ER Diagram - Debug):")
                st.write(er_diagram_response.response)

                st.session_state.er_diagram_code = er_diagram_response.response

            except Exception as e:
                st.error(f"Error generating DB info: {e}")


    # "Refresh DB Info" Button (Initial Generation)
    if st.button("Refresh DB Info"):
        generate_er_diagram()

    # "Re-generate ER Diagram" Button (Uses existing Table Data)
    if st.session_state.table_info_string:  # Only show if table info exists
        if st.button("Re-generate ER Diagram"):
            er_diagram_prompt = f"""
                You are an expert in generating Mermaid code for Entity-Relationship Diagrams (ERDs). Your output will be directly rendered by Mermaid, so it is critical that it be correct.

                Given the following database table schemas, generate a complete Mermaid erDiagram string. Ensure that the generated Mermaid code is syntactically valid and includes all tables and their relationships.

                Database Tables:

                {st.session_state.table_info_string}

                Instructions:

                Start the Mermaid code block with erDiagram.

                For each table, define an entity with its attributes (columns) and data types.

                Mark primary keys with PK and foreign keys with FK. Explicitly state the referenced table for foreign keys.

                Define relationships between tables using the correct Mermaid syntax to represent cardinality (one-to-many, many-to-many, etc.). Use descriptive relationship labels (e.g., "places", "contains", "categorizes").
                Represent relationships between tables using Mermaid's relationship syntax (e.g., ||--o{{ for a one-to-many relationship). Clearly label the relationships (e.g., CUSTOMER ||--o{{ ORDER : places). For foreign keys, always include FK references <TABLE>.<COLUMN>.
                
                Resolve many-to-many relationships with junction tables if necessary (e.g., ORDER_ITEMS between ORDERS and PRODUCTS).
                Ensure there is a one-to-many relationship defined between e.g., CATEGORIES and PRODUCTS and label it something like "categorizes".
                   
                Return only the Mermaid code string, do NOT wrap the code in markdown or other formatting. Return it as one single string.

                Here is an example of a complete, valid Mermaid ER diagram:
                ```plaintext
               erDiagram
                    CUSTOMER {{
                        int customer_id PK
                        string customer_name
                        string customer_email
                    }}

                    ORDER {{
                        int order_id PK
                        int customer_id FK
                        date order_date
                    }}

                    CUSTOMER ||--o{{ ORDER : places
                ```
                Begin!
                """
            er_diagram_response = st.session_state.chat_engine.chat(er_diagram_prompt)
            st.write("### LLM Response (ER Diagram - Debug):")
            st.write(er_diagram_response.response)
            st.session_state.er_diagram_code = er_diagram_response.response  # Update the code

    # Display
    st.header("DB Table List")
    if st.session_state.table_list_df is not None:
        st.header("DB Table List (Summary)") 
        st.dataframe(st.session_state.table_list_df)
        
        st.header("DB Table Details")
        for index, row in st.session_state.table_list_df.iterrows():
            table_name = row["table_name"]
            columns_data = row["columns"]

            st.subheader(f"Table: {table_name}")

            if columns_data:
                table_df = pd.DataFrame(columns_data)  # Create dataframe
                st.dataframe(table_df)
            else:
                st.warning(f"No column data found for table: {table_name}")
    else:
        st.info("Click 'Refresh DB Info' to generate the DB table list.")

    st.header("ER Diagram")
    if st.session_state.er_diagram_code:
        st_mermaid(st.session_state.er_diagram_code)
    else:
        st.info("Click 'Refresh DB Info' to generate the ER diagram.")

with tab4:
    st.title("Generated API List")
with tab5:
    st.title("Settings Tab")
with tab6:
    st.title("About Me: Dzungntnew")

with tab1:
    # --- Streamlit UI ---
    st.title("RAG Chatbot with Ollama and LlamaIndex")

    # Sidebar for file upload
    st.sidebar.header("Upload Documents")
    uploaded_files = st.sidebar.file_uploader(
        "Upload your files (docx, xls, etc.)", accept_multiple_files=True
    )

    # --- Main App Logic ---
    if uploaded_files:
        # Load data and build index (expensive operation, do only when files change)
        with st.spinner("Loading data and building index..."):
            documents = load_data(uploaded_files)
            index = build_index(documents)
            chat_engine = init_chat_engine(index)

        # Store chat engine in session state
        st.session_state.chat_engine = chat_engine

    else:
        st.info("Please upload documents to start the chat.")

    # Initialize session state for chat history (only if chat_engine exists)
    if 'chat_engine' in st.session_state and st.session_state.chat_engine:
        if "messages" not in st.session_state:
            st.session_state.messages = []

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
                response = st.session_state.chat_engine.chat(prompt)
                response_text = str(response)  # Convert to string

            # Add assistant message to chat history
            st.session_state.messages.append({"role": "assistant", "content": response_text})
            with st.chat_message("assistant"):
                st.markdown(response_text)
    elif uploaded_files:
         st.warning("Chat engine is not initialized, after uploaded, please wait util build index, re-fresh to use")