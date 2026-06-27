from sqlalchemy.orm import Session
from models.models import Project, TeamMember, User
from schemas.schemas import ProjectCreate
from fastapi import HTTPException, status

def get_projects_by_team(db: Session, team_id: int, current_user: User) -> list[Project]:
    # Check if user is in the team
    member = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.user_id == current_user.id).first()
    if not member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Não autorizado")
    return db.query(Project).filter(Project.team_id == team_id).all()

def create_project(db: Session, project_data: ProjectCreate, current_user: User) -> Project:
    member = db.query(TeamMember).filter(TeamMember.team_id == project_data.team_id, TeamMember.user_id == current_user.id).first()
    if not member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Não autorizado a criar projeto neste time")
    
    if member and member.role not in ["admin", "member"]:
        raise HTTPException(status_code=403, detail="Apenas admins e membros podem criar projetos")

    db_project = Project(
        name=project_data.name,
        description=project_data.description,
        team_id=project_data.team_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project
