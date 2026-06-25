from sqlalchemy.orm import Session
from models.models import User
from fastapi import HTTPException, status
from services.notification_service import create_notification


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

    create_notification(db, member_id, current_user.id, "member_removed", f"{current_user.name} removeu você da equipe")
    db.delete(db_member)
    db.commit()
