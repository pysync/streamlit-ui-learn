import streamlit as st

st.title("Settings")

st.session_state.debug = st.checkbox("Enable Debug Mode", value=False)

st.write("Other settings can be added here.")
