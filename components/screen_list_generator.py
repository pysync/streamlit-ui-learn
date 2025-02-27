import streamlit as st
import pandas as pd
from llm_service.llm_handler import llm_handler
from llm_service.json_extraction import extract_json  # Import the JSON extraction function
import json


def generate_screen_list(chat_engine):
    """Generates a screen list from the chat engine."""
    try:
        response = chat_engine.chat(
            "Generate a list of screens based on the current system context. "
            "Return a JSON array (list) of JSON objects (dictionaries).  Each JSON object should represent a screen and contain the following keys: "
            "No, Code, Module, Screen_Name, Description.  Make the 'Code' column unique, and use that Code for referent screen between context. Ensure the JSON is valid and parsable. Only return JSON, without other text."
        )
        if st.session_state.debug:
            st.write("### LLM Response (Debug):")
            st.write(response.response)  # Display the raw response
            st.write("### JSON Parse (Debug):")

        # Extract the JSON data
        screen_list_data = extract_json(response.response)

        if screen_list_data is None:
            st.error("No valid JSON found in LLM response.")
            return None

        if st.session_state.debug:
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