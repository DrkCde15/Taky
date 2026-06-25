from sqlalchemy.orm import Session
from models.models import User, Task, Comment, TaskHistory, Notification
from fastapi import HTTPException, status


def get_all_members(db: Session) -> list[User]:
    return db.query(User).all()


def delete_member(db: Session, member_id: int, current_user: User) -> None:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem excluir membros")
    if current_user.id == member_id:
        raise HTTPException(status_code=400, detail="Não é possível excluir a si mesmo")

    db_member = db.query(User).filter(User.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Membro não encontrado")

    db.query(Task).filter(Task.user_id == member_id).update(
        {"user_id": None}, synchronize_session="fetch"
    )
    db.query(Comment).filter(Comment.user_id == member_id).delete()
    db.query(TaskHistory).filter(TaskHistory.user_id == member_id).delete()
    db.query(Notification).filter(
        (Notification.user_id == member_id) | (Notification.actor_id == member_id)
    ).delete()

    db.delete(db_member)
    db.commit()
