from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.security import get_current_user
from schemas.schemas import User
from services import member_service
from models.models import User as UserModel

router = APIRouter(prefix="/members", tags=["members"])


@router.get("", response_model=List[User])
def get_members(db: Session = Depends(get_db)):
    return member_service.get_all_members(db)


@router.delete("/{member_id}")
def delete_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    member_service.delete_member(db, member_id, current_user)
    return {"message": "Member deleted"}
