from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
from core.database import get_db
from core.security import get_current_user, get_current_admin
from schemas.schemas import TaskCreate, Task, Comment, CommentBase
from services import task_service
from models.models import User, TaskFile

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db)):
    return task_service.get_all_tasks(db)


@router.post("", response_model=Task)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.create_task(db, task, current_user)


@router.put("/{task_id}", response_model=Task)
def update_task(
    task_id: int,
    task_update: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.update_task(db, task_id, task_update, current_user)


@router.post("/{task_id}/comments", response_model=Comment)
def add_comment(
    task_id: int,
    comment: CommentBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.add_comment(db, task_id, current_user.id, comment.content)


@router.post("/{task_id}/files")
async def upload_file(
    task_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.upload_task_file(db, task_id, file, current_user)


@router.get("/files/{file_id}")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_file = db.query(TaskFile).filter(TaskFile.id == file_id).first()
    if not db_file:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="File not found")

    file_path = db_file.file_path.lstrip("/")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(file_path, filename=db_file.filename)


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    task_service.delete_task(db, task_id)
    return {"message": "Task deleted"}
