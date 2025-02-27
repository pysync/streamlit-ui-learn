import streamlit as st
from data_management.context_manager import context_manager
from data_management.event_bus import event_bus

class DataEditor:
    def __init__(self, tab_name):
        self.tab_name = tab_name

    def display(self, data):
        """
        Displays an editable table using st.data_editor and handles updates.
        """
        edited_data = st.data_editor(data)

        if st.button("Save Changes", key=f"save_{self.tab_name}"):
            context_manager.update_project_data(self.tab_name, edited_data)
            st.success("Changes saved and broadcasted!")

        return edited_data