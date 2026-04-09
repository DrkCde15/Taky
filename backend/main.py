from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
from dotenv import load_dotenv

import models

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-for-dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# Create uploads directory
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    priority: str = "medium"
    tags: str = ""
    due_date: Optional[datetime] = None
    time_spent: float
    user_id: int
    team_id: Optional[int] = None

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
        orm_mode = True

class TaskFileResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    file_type: str
    created_at: datetime
    class Config:
        orm_mode = True

class TaskHistoryResponse(BaseModel):
    id: int
    action: str
    created_at: datetime
    class Config:
        orm_mode = True

class Task(TaskBase):
    id: int
    created_at: datetime
    comments: List[Comment] = []
    files: List[TaskFileResponse] = []
    history: List[TaskHistoryResponse] = []
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "member"
    avatar: str = ""

class User(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    owner_id: int
    class Config:
        orm_mode = True

# DB Utils
def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Auth Endpoints
@app.post("/register", response_model=User)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        hashed_password = pwd_context.hash(user_data.password)
        user_count = db.query(models.User).count()
        role = "admin" if user_count == 0 else "member"
        
        db_user = models.User(
            name=user_data.name, 
            email=user_data.email, 
            password=hashed_password,
            role=role,
            avatar=user_data.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.name}"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# App Endpoints
@app.get("/tasks", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Add initial history
    history = models.TaskHistory(task_id=db_task.id, user_id=current_user.id, action="Task created")
    db.add(history)
    db.commit()
    return db_task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check for changes to log history
    changes = []
    if db_task.status != task_update.status:
        changes.append(f"Status changed to {task_update.status}")
    if db_task.priority != task_update.priority:
        changes.append(f"Priority changed to {task_update.priority}")
    
    for key, value in task_update.dict().items():
        setattr(db_task, key, value)
    
    db.commit()
    
    for action in changes:
        history = models.TaskHistory(task_id=task_id, user_id=current_user.id, action=action)
        db.add(history)
    db.commit()
    
    db.refresh(db_task)
    return db_task

@app.post("/tasks/{task_id}/comments", response_model=Comment)
def add_comment(task_id: int, comment: CommentBase, db: Session = Depends(get_db)):
    db_comment = models.Comment(task_id=task_id, user_id=comment.user_id, content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.post("/tasks/{task_id}/files")
async def upload_file(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    db_file = models.TaskFile(
        task_id=task_id, 
        filename=file.filename, 
        file_path=f"/uploads/{task_id}_{file.filename}",
        file_type=file.content_type
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}

@app.get("/members", response_model=List[User])
def get_members(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.post("/members/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete members")
    db_member = db.query(models.User).filter(models.User.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(db_member)
    db.commit()
    return {"message": "Member deleted"}

@app.get("/teams", response_model=List[Team])
def get_teams(db: Session = Depends(get_db)):
    return db.query(models.Team).all()

@app.post("/teams", response_model=Team)
def create_team(team: TeamCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create teams")
    db_team = models.Team(name=team.name, owner_id=current_user.id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
