import streamlit as st

def render():
    st.title("Settings")

    st.session_state.debug = st.checkbox("Enable Debug Mode", value=False)

    st.write("Other settings can be added here.")
