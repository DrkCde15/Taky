from sqlalchemy.orm import Session
from models.models import Notification, User
from fastapi import HTTPException, status


def create_notification(db: Session, user_id: int, actor_id: int, type: str, message: str, task_id: int = None):
    if user_id == actor_id:
        return
    notif = Notification(
        user_id=user_id,
        actor_id=actor_id,
        type=type,
        message=message,
        task_id=task_id,
    )
    db.add(notif)
    db.commit()


def get_user_notifications(db: Session, user_id: int) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return db.query(Notification).filter(Notification.user_id == user_id, Notification.read == 0).count()


def mark_as_read(db: Session, notif_id: int, user_id: int) -> Notification:
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == user_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    notif.read = 1
    db.commit()
    db.refresh(notif)
    return notif


def mark_all_as_read(db: Session, user_id: int):
    db.query(Notification).filter(Notification.user_id == user_id, Notification.read == 0).update({"read": 1})
    db.commit()
