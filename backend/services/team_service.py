from sqlalchemy.orm import Session
from models.models import Team, User
from schemas.schemas import TeamCreate
from fastapi import HTTPException, status


def get_user_teams(db: Session, current_user: User) -> list[Team]:
    from models.models import TeamMember
    owned = db.query(Team).filter(Team.owner_id == current_user.id).all()
    member_team_ids = [
        tm.team_id for tm in db.query(TeamMember).filter(TeamMember.user_id == current_user.id).all()
    ]
    member_teams = db.query(Team).filter(Team.id.in_(member_team_ids)).all() if member_team_ids else []
    seen = set()
    result = []
    for t in owned + member_teams:
        if t.id not in seen:
            seen.add(t.id)
            result.append(t)
    return result


def create_team(db: Session, team_data: TeamCreate, current_user: User) -> Team:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem criar equipes")
    db_team = Team(name=team_data.name, owner_id=current_user.id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    from models.models import TeamMember
    member = TeamMember(user_id=current_user.id, team_id=db_team.id, role="admin")
    db.add(member)
    db.commit()

    return db_team


def update_team(db: Session, team_id: int, team_data: TeamCreate, current_user: User) -> Team:
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    if db_team.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Apenas o criador da equipe pode editá-la")
    db_team.name = team_data.name
    db.commit()
    db.refresh(db_team)
    return db_team


def delete_team(db: Session, team_id: int, current_user: User) -> None:
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")
    if db_team.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Apenas o criador da equipe pode excluí-la")
    db.delete(db_team)
    db.commit()


def join_team(db: Session, team_id: int, current_user: User) -> User:
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipe não encontrada")

    from models.models import TeamMember
    existing = db.query(TeamMember).filter(TeamMember.user_id == current_user.id, TeamMember.team_id == team_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Usuário já está nesta equipe")

    member = TeamMember(user_id=current_user.id, team_id=team_id, role="member")
    db.add(member)
    db.commit()
    db.refresh(current_user)
    return current_user
