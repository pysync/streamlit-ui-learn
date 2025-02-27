import streamlit as st
from components.chat_interface import ChatInterface

st.title("Project Overview")

# Display the chat interface
chat_interface = ChatInterface()
chat_interface.display()