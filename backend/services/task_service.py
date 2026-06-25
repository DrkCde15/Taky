from sqlalchemy.orm import Session
from models.models import Task, TaskHistory, Comment, TaskFile, User, Notification
from schemas.schemas import TaskCreate
from fastapi import HTTPException, status
from core.config import settings
from services.notification_service import create_notification
import os
import shutil
from utils.validators import sanitize_filename


STATUS_LABELS = {
    "todo": "A Fazer",
    "in_progress": "Em Andamento",
    "blocked": "Bloqueado",
    "done": "Concluído",
}


def get_all_tasks(db: Session) -> list[Task]:
    return db.query(Task).all()


def create_task(db: Session, task_data: TaskCreate, current_user: User) -> Task:
    db_task = Task(**task_data.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    history = TaskHistory(task_id=db_task.id, user_id=current_user.id, action="Tarefa criada")
    db.add(history)

    if db_task.user_id and db_task.user_id != current_user.id:
        create_notification(
            db, db_task.user_id, current_user.id, "task_assigned",
            f"{current_user.name} criou a tarefa '{db_task.title}' para você",
            db_task.id,
        )

    db.commit()
    return db_task


def update_task(db: Session, task_id: int, task_update: TaskCreate, current_user: User) -> Task:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    changes = []
    if db_task.status != task_update.status:
        changes.append(f"Status alterado para {STATUS_LABELS.get(task_update.status, task_update.status)}")
    if db_task.priority != task_update.priority:
        changes.append(f"Prioridade alterada para {task_update.priority}")

    old_user_id = db_task.user_id
    for key, value in task_update.model_dump().items():
        setattr(db_task, key, value)

    db.commit()

    for action in changes:
        history = TaskHistory(task_id=task_id, user_id=current_user.id, action=action)
        db.add(history)

    if db_task.user_id and db_task.user_id != current_user.id:
        if old_user_id != db_task.user_id:
            create_notification(
                db, db_task.user_id, current_user.id, "task_assigned",
                f"{current_user.name} atribuiu você na tarefa '{db_task.title}'",
                db_task.id,
            )
        elif changes:
            status_msg = changes[0] if any("Status" in c for c in changes) else None
            if status_msg:
                create_notification(
                    db, db_task.user_id, current_user.id, "status_changed",
                    f"{current_user.name} {status_msg.lower()} em '{db_task.title}'",
                    db_task.id,
                )

    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> None:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db.delete(db_task)
    db.commit()


def add_comment(db: Session, task_id: int, user_id: int, content: str) -> Comment:
    db_comment = Comment(task_id=task_id, user_id=user_id, content=content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    task = db.query(Task).filter(Task.id == task_id).first()
    current_user = db.query(User).filter(User.id == user_id).first()
    if task and task.user_id and task.user_id != user_id:
        create_notification(
            db, task.user_id, user_id, "new_comment",
            f"{current_user.name} comentou em '{task.title}'",
            task_id,
        )
        db.commit()

    return db_comment


def upload_task_file(db: Session, task_id: int, file, current_user: User) -> TaskFile:
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail=f"Arquivo muito grande. Tamanho máximo: {settings.MAX_UPLOAD_SIZE // (1024*1024)}MB")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Tipo de arquivo .{ext} não permitido")

    safe_filename = sanitize_filename(f"{task_id}_{file.filename}")
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_file = TaskFile(
        task_id=task_id,
        filename=file.filename,
        file_path=f"/uploads/{safe_filename}",
        file_type=file.content_type,
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file
