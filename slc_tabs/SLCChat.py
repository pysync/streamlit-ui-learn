import streamlit as st
from components.chat_interface import ChatInterface

def render():
    # Display the chat interface
    chat_interface = ChatInterface()
    chat_interface.display()