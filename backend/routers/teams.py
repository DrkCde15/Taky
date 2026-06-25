from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.security import get_current_user
from schemas.schemas import TeamCreate, Team, User as UserSchema
from services import team_service
from models.models import User

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=List[Team])
def get_teams(db: Session = Depends(get_db)):
    return team_service.get_all_teams(db)


@router.post("", response_model=Team)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return team_service.create_team(db, team, current_user)


@router.post("/{team_id}/join", response_model=UserSchema)
def join_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return team_service.join_team(db, team_id, current_user)
