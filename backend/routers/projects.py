from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.security import get_current_user
from schemas.schemas import ProjectCreate, Project
from services import project_service
from models.models import User

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/team/{team_id}", response_model=List[Project])
def get_team_projects(team_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return project_service.get_projects_by_team(db, team_id, current_user)

@router.post("", response_model=Project)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return project_service.create_project(db, project, current_user)
