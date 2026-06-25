from sqlalchemy.orm import Session
from models.models import User, InviteToken
from schemas.schemas import UserCreate
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from core.config import settings
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import secrets


def register_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    hashed_password = hash_password(user_data.password)
    user_count = db.query(User).count()

    if user_count == 0:
        role = "admin"
    elif user_data.role == "admin":
        existing_admin = db.query(User).filter(User.role == "admin").first()
        if existing_admin:
            raise HTTPException(status_code=400, detail="Já existe um administrador no sistema")
        role = "admin"
    else:
        role = "member"

    avatar = user_data.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.name}"
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=role,
        avatar=avatar,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="E-mail ou senha incorretos")
    return user


def create_user_tokens(user: User) -> dict:
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email, "user_id": user.id, "role": user.role})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user,
    }


def refresh_access_token(db: Session, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token de atualização inválido")

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return create_user_tokens(user)


def create_invite_token(db: Session, user_id: int) -> InviteToken:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=7)
    invite = InviteToken(
        token=token,
        created_by=user_id,
        expires_at=expires_at,
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return invite


def validate_invite_token(db: Session, token: str) -> InviteToken:
    invite = db.query(InviteToken).filter(InviteToken.token == token).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Token de convite inválido")
    if invite.used:
        raise HTTPException(status_code=400, detail="Token de convite já usado")
    if invite.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token de convite expirado")
    return invite


def use_invite_token(db: Session, token: str) -> None:
    invite = validate_invite_token(db, token)
    invite.used = 1
    db.commit()
