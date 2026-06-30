from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from core.config import settings
from core.database import Base, engine
from routers import auth, tasks, members, teams, notifications, projects
from core.security import get_current_user
from pathlib import Path
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Taky API", version="2.0.0")

if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(members.router)
app.include_router(teams.router)
app.include_router(projects.router)
app.include_router(notifications.router)

from core.websocket import manager

@app.websocket("/ws/projects/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: int):
    await manager.connect(websocket, project_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str = ""):
    path = full_path or "index.html"
    file = FRONTEND_DIST / path
    if file.is_file():
        return FileResponse(file)
    spa = FRONTEND_DIST / "index.html"
    if spa.exists():
        return FileResponse(spa, media_type="text/html")
    return JSONResponse({"detail": "Not Found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
