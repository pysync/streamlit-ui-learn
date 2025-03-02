# backend/app.py
from fastapi import FastAPI
from backend.routers import artifact
from backend.routers import workspace
from backend.config import init_db

app = FastAPI(title="Artifacts API with LlamaIndex and ChromaDB")

# Initialize database (if using SQLModel without Alembic)
init_db()

app.include_router(artifact.router)
app.include_router(workspace.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
