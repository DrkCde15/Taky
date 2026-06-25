from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
import re


class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    priority: str = "medium"
    tags: str = ""
    due_date: Optional[datetime] = None
    time_spent: float
    user_id: Optional[int] = None
    team_id: Optional[int] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v not in ("low", "medium", "high"):
            raise ValueError("Prioridade deve ser baixa, média ou alta")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in ("todo", "in_progress", "blocked", "done"):
            raise ValueError("Status inválido")
        return v


class TaskCreate(TaskBase):
    pass


class CommentBase(BaseModel):
    content: str
    user_id: int


class Comment(CommentBase):
    id: int
    task_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TaskFileResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    file_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class TaskHistoryResponse(BaseModel):
    id: int
    action: str
    created_at: datetime

    class Config:
        from_attributes = True


class Task(TaskBase):
    id: int
    created_at: datetime
    comments: List[Comment] = []
    files: List[TaskFileResponse] = []
    history: List[TaskHistoryResponse] = []

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "member"
    avatar: str = ""

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("A senha deve ter pelo menos 8 caracteres")
        if not re.search(r"[A-Z]", v):
            raise ValueError("A senha deve conter uma letra maiúscula")
        if not re.search(r"[a-z]", v):
            raise ValueError("A senha deve conter uma letra minúscula")
        if not re.search(r"\d", v):
            raise ValueError("A senha deve conter um número")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+]", v):
            raise ValueError("A senha deve conter um caractere especial")
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", v):
            raise ValueError("Formato de e-mail inválido")
        return v


class User(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: str
    team_id: Optional[int] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: User


class RefreshRequest(BaseModel):
    refresh_token: str


class TeamBase(BaseModel):
    name: str


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


class InviteCreate(BaseModel):
    pass


class InviteResponse(BaseModel):
    token: str
    expires_at: datetime
    invite_url: str


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    actor_id: Optional[int] = None
    type: str
    message: str
    task_id: Optional[int] = None
    read: int
    created_at: datetime

    class Config:
        from_attributes = True
