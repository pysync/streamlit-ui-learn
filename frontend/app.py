import streamlit as st
from streamlit_extras.tags import tagger_component
import pandas as pd

import client  # our API client for backend calls
import uuid
from streamlit_elements import dashboard
from streamlit_elements import elements, mui, html
from st_aggrid import AgGrid

# Set the page configuration
st.set_page_config(page_title="My Project Frontend", layout="wide")


@st.dialog("Create New Workspace")
def create_workspace():
    title = st.text_input("Title")
    description = st.text_area("Description")
    if st.button("Submit"):
        new_ws = client.create_workspace(title, description)
        st.success(f"Workspace '{new_ws['title']}' created!")
        st.session_state.active_workspace = new_ws["id"]
        #st.query_params(page="Workspace Working")
        #st.rerun()

def render_workspace_list(response):
    workspaces = response.get("items", [])
    
    if workspaces:
        df = pd.DataFrame(workspaces)
        grid_response = AgGrid(df, rowSelection='single')
        
        selected_rows = grid_response['selected_rows']
        if selected_rows is None or selected_rows.empty:
            pass
        else:
            selected_id = int(selected_rows['id'].values[0])
            selected_workspace_title = str(selected_rows['title'].values[0])
            st.session_state.active_workspace_id = selected_id
            st.session_state.active_workspace_title = selected_workspace_title
            st.switch_page('working.py')
    else:
        st.info("No workspaces found, create one using the button above.")
        
def manager_workspace_page():
    st.header("Manager Workspace")
    
    tagger_component(
        "Here are colored tags",
        ["turtle", "rabbit", "lion"],
        color_name=["blue", "orange", "lightblue"],
    )


    # Button to create a new workspace using a dialog
    if st.button("Create New Workspace"):
        create_workspace()
    
    
    # Get the list of workspaces from the backend
    response = client.get_workspaces()  # returns a list of dicts with keys: id, title, last_update
    st.subheader("List of Workspaces")
    render_workspace_list(response) # simple table rendering

def main():
    pages = [
        st.Page(manager_workspace_page, title="Your Projects"),
        st.Page('working.py', title="Working"),
    ]
    pg = st.navigation(pages)
    pg.run()
    
if __name__ == "__main__":
    main()

