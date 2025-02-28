import streamlit as st
import sqlite3
import datetime
import json
import random
import pandas as pd
##############################
# 1. SQL Database Setup (SQLite)
##############################

def init_db():
    conn = sqlite3.connect("artifacts.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS artifacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        type TEXT,
        title TEXT,
        content TEXT,
        version INTEGER,
        parent_version INTEGER,
        status TEXT,           -- "current" or "archived"
        dependencies TEXT,     -- JSON string (e.g., '["api_001", "function_003"]')
        created_at TEXT,
        updated_at TEXT
    )
    ''')
    conn.commit()
    return conn

conn = init_db()

# -------------------------------
# 2. ChromaDB & LlamaIndex Setup
# -------------------------------



OLLAMA_MODEL = "deepseek-r1"  # Or any other model you have in Ollama
EMBEDDING_MODEL = "deepseek-r1" # Or any other embedding model you have in Ollama
OLLAMA_HOST = "http://10.1.11.60:11434"
OLLAMA_TIMEOUT = 300.0


from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding

from llama_index.core import (
    Settings,
    Document, 
    VectorStoreIndex,
    StorageContext,
    SimpleDirectoryReader,
)

import chromadb
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.chroma import ChromaVectorStore

# create llm client
llm = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_HOST, request_timeout=OLLAMA_TIMEOUT)
embed_model = OllamaEmbedding(model_name=OLLAMA_MODEL, base_url=OLLAMA_HOST, request_timeout=OLLAMA_TIMEOUT)

# setting to use as global
Settings.embed_model = embed_model
Settings.llm = llm


# initialize client, setting path to save data
vector_db = chromadb.PersistentClient(path="./chroma_db")

# create collection
chroma_collection = vector_db.get_or_create_collection("quickstart")

# assign chroma as the vector_store to the context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)


# Direct collection access (if needed)
collection = vector_db.get_or_create_collection("software_artifacts")
##############################
# 3. Helper Functions for Artifact Management
##############################

def insert_artifact(document_id, art_type, title, content, version, parent_version, dependencies, status):
    now = datetime.datetime.now().isoformat()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO artifacts (document_id, type, title, content, version, parent_version, status, dependencies, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (document_id, art_type, title, content, version, parent_version, status, json.dumps(dependencies), now, now))
    conn.commit()
    # Note: We will rebuild the index from SQL so we don't directly update the vector store here.

def get_current_artifact(document_id):
    cursor = conn.cursor()
    cursor.execute('''
    SELECT * FROM artifacts 
    WHERE document_id = ? AND status = 'current'
    ORDER BY version DESC LIMIT 1
    ''', (document_id,))
    return cursor.fetchone()

def get_artifact_versions(document_id):
    cursor = conn.cursor()
    cursor.execute('''
    SELECT * FROM artifacts WHERE document_id = ?
    ORDER BY version DESC
    ''', (document_id,))
    return cursor.fetchall()

def update_artifact_db(document_id, new_title, new_content, new_dependencies):
    current = get_current_artifact(document_id)
    if not current:
        st.error("Artifact not found.")
        return
    current_version = current[5]  # version field
    new_version = current_version + 1
    cursor = conn.cursor()
    # Archive the current version
    cursor.execute('''
    UPDATE artifacts SET status = 'archived' WHERE document_id = ? AND version = ?
    ''', (document_id, current_version))
    conn.commit()
    art_type = current[2]
    insert_artifact(document_id, art_type, new_title, new_content, new_version, current_version, new_dependencies, 'current')

def rollback_artifact_db(document_id, target_version):
    cursor = conn.cursor()
    cursor.execute('''
    SELECT * FROM artifacts WHERE document_id = ? AND version = ?
    ''', (document_id, target_version))
    target = cursor.fetchone()
    if not target:
        st.error("Target version not found.")
        return
    current = get_current_artifact(document_id)
    if current:
        cursor.execute('''
        UPDATE artifacts SET status = 'archived' WHERE document_id = ? AND version = ?
        ''', (document_id, current[5]))
        conn.commit()
    new_version = (current[5] + 1) if current else target_version
    art_type = target[2]
    title = target[3]
    content = target[4]
    dependencies = json.loads(target[8]) if target[8] else []
    insert_artifact(document_id, art_type, title, content, new_version, target[5], dependencies, 'current')
    st.success("Rollback complete.")

def rebuild_index():
    """
    Rebuild the LlamaIndex from all "current" artifacts in the SQL database.
    Only these will be included in the vector index.
    """
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM artifacts WHERE status = 'current'")
    rows = cursor.fetchall()
   
    for row in rows:
        # Schema: 0:id, 1:document_id, 2:type, 3:title, 4:content, 5:version, 6:parent_version, 7:status, 8:dependencies, 9:created_at, 10:updated_at
        doc = Document(
            text=row[4], 
            id_=f"doc_id_{row[1]}",
            metadata={
                "file_name": f"doc_{row[1]}",
                "document_id": row[1],
                "version": row[5],
                "title": row[3],
                "type": row[2],
                "status": row[7],
                "dependencies": row[8], # JSON string
            },
        )
        st.write(f"loaded: {row[1]} - {row[3]} -> to indexing")
        index = VectorStoreIndex.from_documents([doc], storage_context=storage_context) 
        st.write(f"indexed: {row[1]} - {row[3]} -> done")
    return index

##############################
# 4. Streamlit UI
##############################

st.title("Artifact Management System with Chat & Versioning")

menu = st.sidebar.selectbox("Menu", 
                            ["Home", "Add Artifact", "Update Artifact", "Rollback Artifact", "View Versions", "Chat"])

if menu == "Home":
    st.header("Current Artifacts")
    cursor = conn.cursor()
    # Schema: 0:id, 1:document_id, 2:type, 3:title, 4:content, 5:version, 6:parent_version, 7:status, 8:dependencies, 9:created_at, 10:updated_at
    cursor.execute("SELECT DISTINCT document_id, title, type, version, dependencies FROM artifacts WHERE status = 'current'")
    arts = cursor.fetchall()
    if arts:
        docs = [{ "id": art[0], "title": art[1], "type": art[2], "version": art[3], "dependencies": art[4] } for art in arts]
        
        df = pd.DataFrame(docs)
        #st.dataframe(pd.DataFrame(docs))
        # render the dataframe
        for index, row in df.iterrows():
            col1, col2 = st.columns([5, 1])
            with col1:
                st.write(f"**{row['id']}** - {row['title']} ({row['type']})")
            with col2:
                if st.button("show", key=row['id']):
                    st.session_state.selected_doc = row['id']
        
        if "selected_doc" in st.session_state:
            st.markdown(f"### Detail for Document ID: **{st.session_state.selected_doc}**")
            st.write(df[df['id'] == st.session_state.selected_doc])
            
        
        # for art in arts:
        #     st.markdown(f"**Document ID:** {art[0]} | **Title:** {art[1]} | **Type:** {art[2]}")
    else:
        st.info("No artifacts found.")

elif menu == "Add Artifact":
    st.header("Add New Artifact")
    doc_id = st.text_input("Document ID")
    art_type = st.text_input("Artifact Type (e.g., screen_list, srs, api_list)")
    title = st.text_input("Title")
    content = st.text_area("Content")
    deps_str = st.text_input("Dependencies (comma-separated Document IDs)", value="")
    if st.button("Add Artifact"):
        if doc_id and art_type and title and content:
            deps = [d.strip() for d in deps_str.split(",") if d.strip()] if deps_str else []
            insert_artifact(doc_id, art_type, title, content, 1, None, deps, "current")
            st.success("Artifact added successfully!")
        else:
            st.error("Please fill in all fields.")

elif menu == "Update Artifact":
    st.header("Update Artifact")
    doc_id = st.text_input("Document ID to update")
    new_title = st.text_input("New Title")
    new_content = st.text_area("New Content")
    new_deps_str = st.text_input("New Dependencies (comma-separated Document IDs)", value="")
    if st.button("Update Artifact"):
        if doc_id and new_title and new_content:
            new_deps = [d.strip() for d in new_deps_str.split(",") if d.strip()] if new_deps_str else []
            update_artifact_db(doc_id, new_title, new_content, new_deps)
            st.success("Artifact updated!")
        else:
            st.error("Please provide Document ID, Title, and Content.")

elif menu == "Rollback Artifact":
    st.header("Rollback Artifact")
    doc_id = st.text_input("Document ID to rollback")
    target_version = st.number_input("Target Version", min_value=1, step=1)
    if st.button("Rollback Artifact"):
        if doc_id:
            rollback_artifact_db(doc_id, int(target_version))
            st.success("Rollback performed!")
        else:
            st.error("Please provide a Document ID.")

elif menu == "View Versions":
    st.header("View Artifact Versions")
    doc_id = st.text_input("Enter Document ID to view versions")
    if st.button("View Versions"):
        if doc_id:
            versions = get_artifact_versions(doc_id)
            if versions:
                for ver in versions:
                    st.markdown(f"**Version:** {ver[5]} | **Title:** {ver[3]} | **Status:** {ver[7]} | **Updated At:** {ver[10]}")
            else:
                st.info("No versions found.")
        else:
            st.error("Please provide a Document ID.")

elif menu == "Chat":
    st.header("Chat About Current Artifacts")
    query = st.text_input("Enter your query about current artifacts")
    if st.button("Chat"):
        index = rebuild_index()
        if index is None:
            st.error("No current artifacts available in the index.")
        else:
            # Create a query engine with a filter: only include documents where status=="current"
            query_engine = index.as_query_engine()
            #query_engine = index.as_query_engine(query_kwargs={"where": {"status": "current"}})
            
            response = query_engine.query(query)
            st.write("### Chat Response:")
            st.write(response)
            st.write("### Reference Documents:")
            # Display each source's metadata (document_id and version)
            for node in response.source_nodes:
                ref_doc_id = node.metadata.get("document_id", "N/A")
                ref_version = node.metadata.get("version", "N/A")
                st.markdown(f"- **Document ID:** {ref_doc_id}, **Version:** {ref_version}")