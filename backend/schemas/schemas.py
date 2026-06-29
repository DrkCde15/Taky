from pydantic import BaseModel, field_validator
from typing import List, Optional, ForwardRef
from datetime import datetime
import re

class TimeLogBase(BaseModel):
    time_spent: float
    description: Optional[str] = None

class TimeLogCreate(TimeLogBase):
    pass

class TimeLogResponse(TimeLogBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    priority: str = "medium"
    tags: str = ""
    due_date: Optional[datetime] = None
    user_id: Optional[int] = None
    project_id: int
    parent_id: Optional[int] = None

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
    creator_id: Optional[int] = None
    comments: List[Comment] = []
    files: List[TaskFileResponse] = []
    history: List[TaskHistoryResponse] = []
    timelogs: List[TimeLogResponse] = []
    subtasks: List['Task'] = []

    class Config:
        from_attributes = True

Task.model_rebuild()

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

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None

class TeamMemberResponse(BaseModel):
    id: int
    user_id: int
    team_id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class User(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: str
    team_memberships: List[TeamMemberResponse] = []

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
    members: List[TeamMemberResponse] = []

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    team_id: int

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    tasks: List[Task] = []

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
