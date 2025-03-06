# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import artifact
from backend.routers import workspace
from backend.config import init_db

origins = [
    "http://localhost.local.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app = FastAPI(title="Artifacts API with LlamaIndex and ChromaDB")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database (if using SQLModel without Alembic)
init_db()

app.include_router(artifact.router)
app.include_router(workspace.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
