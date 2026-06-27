from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user, get_current_admin
from schemas.schemas import UserCreate, User, Token, RefreshRequest, InviteResponse, UserUpdate
from services import auth_service
from models.models import User as UserModel

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=User)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return auth_service.register_user(db, user_data)


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    return auth_service.create_user_tokens(user)


@router.post("/refresh", response_model=Token)
def refresh_token(request: RefreshRequest, db: Session = Depends(get_db)):
    return auth_service.refresh_access_token(db, request.refresh_token)


@router.get("/me", response_model=User)
def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=User)
def update_me(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    return auth_service.update_user(db, current_user.id, user_data)


@router.post("/invite", response_model=InviteResponse)
def create_invite(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin),
):
    from core.config import settings
    invite = auth_service.create_invite_token(db, current_user.id)
    return InviteResponse(
        token=invite.token,
        expires_at=invite.expires_at,
        invite_url=f"http://localhost:5173/invite?token={invite.token}",
    )


@router.post("/invite/validate")
def validate_invite(token: str, db: Session = Depends(get_db)):
    auth_service.validate_invite_token(db, token)
    return {"valid": True}
