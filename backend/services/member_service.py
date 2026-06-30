from sqlalchemy.orm import Session
from models.models import User, Team, TeamMember, Task, Comment, TaskHistory, Notification
from fastapi import HTTPException, status


def get_all_members(db: Session) -> list[User]:
    return db.query(User).all()


def delete_member(db: Session, member_id: int, current_user: User) -> None:
    if current_user.id == member_id:
        raise HTTPException(status_code=400, detail="Não é possível excluir a si mesmo")

    db_member = db.query(User).filter(User.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Membro não encontrado")

    owned_team_ids = [t.id for t in db.query(Team).filter(Team.owner_id == current_user.id).all()]
    admin_team_ids = [
        tm.team_id for tm in db.query(TeamMember).filter(
            TeamMember.user_id == current_user.id,
            TeamMember.role == "admin",
        ).all()
    ]
    managed_team_ids = list(set(owned_team_ids + admin_team_ids))
    if not managed_team_ids:
        raise HTTPException(status_code=403, detail="Você não é administrador de nenhuma equipe")

    target_membership = db.query(TeamMember).filter(
        TeamMember.user_id == member_id,
        TeamMember.team_id.in_(managed_team_ids),
    ).first()
    if not target_membership:
        raise HTTPException(
            status_code=403,
            detail="Este membro não está em nenhuma equipe que você administra",
        )

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
