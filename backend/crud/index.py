# backend/crud/index.py

from backend.rag.crud import clear_index, insert_doc, delete_doc, update_doc
from backend.rag.index import vector_index
from backend.crud.artifact import list_artifacts 

import uuid
import time

# In-memory store to track reindexing task statuses
reindexing_tasks = {}


def reindex_all_documents():
    """
    Reindexes all artifacts from the database into the vector store.
    Returns a task ID for tracking the status.
    """
    clear_index()
    
    task_id = str(uuid.uuid4())
    reindexing_tasks[task_id] = {"status": "in-progress", "start_time": time.time()}
    
    # Fetch all artifacts from the database without pagination
    artifacts, total = list_artifacts(limit=-1)  # Get all artifacts
    
    for artifact in artifacts:
        # Insert each artifact into the vector store (using document_id, title, and content)
        insert_doc(artifact.document_id, artifact.title, artifact.content)  # Insert artifact into the vector store
    
    reindexing_tasks[task_id]["status"] = "completed"
    return {"task_id": task_id, "status": "reindexing started", "total_artifacts": total}


def get_reindexing_status(task_id: str = None):
    """
    Fetches the reindexing status. If a task_id is provided, returns the status of that task.
    If no task_id is provided, returns all task statuses.
    """
    if task_id:
        task = reindexing_tasks.get(task_id)
        if task:
            return task
        return {"status": "not found"}
    return reindexing_tasks
