import streamlit as st
from streamlit_extras.tags import tagger_component
import pandas as pd

import client  # our API client for backend calls
import uuid
from streamlit_elements import dashboard
from streamlit_elements import elements, mui, html
from st_aggrid import AgGrid

# Set the page configuration
# st.set_page_config(page_title="My Project Frontend", layout="wide")

def gen_doc_id():
    return str(uuid.uuid4())


@st.dialog("Create New Artifact")
def create_artifact():
    title = st.text_input("Artifact Title")
    content = st.text_area("Content")
    art_type = st.selectbox("Artifact Type", ["document", "note", "other"])
    if st.button("Submit"):
        # workspace_id: int, document_id: str, title: str, content: str, art_type: str
        client.create_artifact(
            workspace_id=st.session_state.active_workspace_id, 
            document_id=gen_doc_id(),
            title=title,
            content=content,
            art_type=art_type
        )
        st.success("Artifact created!")
        #st.rerun()
                   
@st.dialog("Edit Artifact")
def edit_artifact(artifact, artifacts=[]):
    title = st.text_input(label='title', value=artifact['title'])
    content = st.text_area(label='content', value=artifact['content'])
    art_type = st.selectbox("Artifact Type", ["document", "note", "other"], disabled=True)
    
    if artifact['dependencies']:
        default_dependencies_titles = [f"id:{item['id']}_{item['title']}" for item in artifacts if item['id'] in artifact['dependencies']]
    else:
        default_dependencies_titles = []
        
    selectable_artifacts = [item for item in artifacts if item['document_id'] != artifact['document_id']]
    selectable_artifacts_titles = [f"id:{item['id']}_{item['title']}" for item in selectable_artifacts]
    
    dependencies_options = st.multiselect(
        "Dependencies",
        selectable_artifacts_titles,
        default_dependencies_titles,
    )
    if dependencies_options:
        st.write(dependencies_options)
        dependencies_ids = [int(label.split('_')[0].split(':')[1]) for label in dependencies_options]
    else:
        dependencies_ids = []
               
       
    if st.button("Save"):
        # document_id: str, title: str, content: str, dependencies: List
        client.update_artifact_version(
            document_id=artifact['document_id'],
            title=title,
            content=content,
            dependencies=dependencies_ids
        )
        st.toast("Artifact updated!")
        #st.success("Artifact updated!")
        st.rerun()
        
@st.dialog("Upload New Artifact")
def upload_artifact():
    uploaded_file = st.file_uploader("Upload Artifact File", type=["pdf", "txt", "docx", "csv", "xlsx"])
    if uploaded_file:
        if st.button("Submit"):
            client.upload_artifact(st.session_state.active_workspace_id, uploaded_file)
            st.success("Artifact uploaded!")
            #st.rerun()
   
        
def render_artifact_list(response):
    artifacts = response.get("items", [])
    if artifacts:
        df = pd.DataFrame(artifacts)
        grid_response = AgGrid(df, rowSelection='single')
        selected_rows = grid_response['selected_rows']
        
        if selected_rows is None or selected_rows.empty:
            pass
        else:
            selected_id = int(selected_rows['id'].values[0])
            selected_artifact = [item for item in artifacts if item['id'] == selected_id][0]
            edit_artifact(selected_artifact, artifacts=artifacts)
            
    else:
        st.info("No artifacts found.")
        


def main():
    if "active_workspace_id" not in st.session_state:
        st.error("No active workspace. Please select one in Manager Workspace.")
        return
    else:
        st.header(f"{st.session_state.active_workspace_title} Working Space")
    
    # Create tabs for different workspace functionalities
    tab1, tab2, tab3 = st.tabs(["Artifacts", "Notes/Chat", "Other"])

    with tab1:
        st.subheader("Artifacts")
        # Two buttons: one for uploading and one for creating new artifact
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            if st.button("Upload Artifact"):
                upload_artifact()
        with col2:
            if st.button("New Artifact"):
                create_artifact()
        with col3:
            if st.button("ReIndex All"):
                client.reindex_all(st.session_state.active_workspace_id)
        with col4:
            if st.button("Clean Indexs"):
                client.clear_vector_store(st.session_state.active_workspace_id)
                
        # Render artifact list
        response = client.list_artifacts(st.session_state.active_workspace_id)
        render_artifact_list(response)

    with tab2:
        st.subheader("Notes / Chat")
        # Toggle between chat widget and note editor modes
        mode = st.toggle("Switch to Note Editor", value=False)
        if mode:
            st.write("### Note Editor Mode")
            # Sidebar: list note artifacts (dummy API)
            notes = client.get_notes(st.session_state.active_workspace_id)
            active_note = None
            if notes:
                active_note = st.sidebar.selectbox("Select Note", options=[note["id"] for note in notes])
            else:
                st.info("No notes available, a new note will be created.")
            # Render a note editor (use st.text_area)
            note_text = st.text_area("Note Content", value=client.get_note_content(active_note) if active_note else "", height=300)
            if st.button("Save Note"):
                client.save_note(st.session_state.active_workspace_id, note_text)
                st.success("Note saved!")
        else:
            st.write("### Chat Widget Mode")
            # Container for chat messages
            chat_container = st.container()
            # Display dummy chat history stored in session_state (if any)
            chat_history = st.session_state.get("chat_history", [])
            for message in chat_history:
                if message["role"] == "user":
                    chat_container.chat_message("user").write(message["content"])
                else:
                    chat_container.chat_message("assistant").write(message["content"])
            # Chat input widget
            if prompt := st.chat_input("Say something"):
                # Append user message and a dummy assistant response to chat history
                chat_container.chat_message("user").write(prompt)
                response = f"Echo: {prompt}"
                chat_container.chat_message("assistant").write(response)
                chat_history.append({"role": "user", "content": prompt})
                chat_history.append({"role": "assistant", "content": response})
                st.session_state.chat_history = chat_history
                # Under the assistant's message, show a checkbox to select it
                if st.checkbox("Select this message for note", key=f"select_{len(chat_history)}"):
                    selected = st.session_state.get("selected_messages", [])
                    selected.append(response)
                    st.session_state.selected_messages = selected
            # In the sidebar, a button to merge selected messages to note
            if st.sidebar.button("Save selected messages"):
                if "selected_messages" in st.session_state:
                    merged_text = "\n".join(st.session_state.selected_messages)
                    st.session_state.note_text = merged_text
                    st.sidebar.success("Merged messages saved to note!")
                else:
                    st.sidebar.warning("No messages selected.")
    with tab3:
        st.subheader("Other")
        st.write("Additional functionalities can be implemented here.")

main()
