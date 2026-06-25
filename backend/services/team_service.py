from sqlalchemy.orm import Session
from models.models import Team, User
from schemas.schemas import TeamCreate
from fastapi import HTTPException, status


def get_all_teams(db: Session) -> list[Team]:
    return db.query(Team).all()


def create_team(db: Session, team_data: TeamCreate, current_user: User) -> Team:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem criar equipes")
    db_team = Team(name=team_data.name, owner_id=current_user.id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team
