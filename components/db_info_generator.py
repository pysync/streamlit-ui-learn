import streamlit as st
import pandas as pd
from llm_service.llm_handler import llm_handler
from llm_service.json_extraction import extract_json
from streamlit_mermaid import st_mermaid

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
        - "table_description" (STRING, optional): A brief description of the table's purpose.
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
            "table_description": "Stores information about customers.",
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
            "table_description": "Stores information about customer orders.",
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

        if st.session_state.debug:
            st.write("### LLM Response (Table List - Debug):")
            st.write(table_list_response.response)
            st.write("### JSON Parse (Debug):")

        table_list_data = extract_json(table_list_response.response)

        if table_list_data is None:
            st.error("No valid JSON found in LLM response.")
            return None, None

        if st.session_state.debug:
            st.json(table_list_data)

        # Prepare data for the summary table
        summary_data = []
        for i, table in enumerate(table_list_data):
            column_names = ", ".join([col['column_name'] for col in table['columns']])
            summary_data.append({
                "No": i + 1,
                "Table Name": table['table_name'],
                "Table Description": table.get('table_description', 'No description available'), # handle missing description
                "Columns": column_names
            })

        table_list_df = pd.DataFrame(summary_data) #dataframe for summary

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
                if 'is_foreign_key' in column and column["is_foreign_key"]:
                    table_info_string += f", FOREIGN KEY{references_info})"
                else:
                    table_info_string += ")"
                table_info_string += "\n"
        
        if st.session_state.debug:
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

        if st.session_state.debug:
            # Debug output for ER diagram response
            st.write("### LLM Response (ER Diagram - Debug):")
            st.write(er_diagram_response.response)

        er_diagram_code = er_diagram_response.response

        return table_list_df, er_diagram_code
    except Exception as e:
        st.error(f"Error generating DB info: {e}")
        return None, None