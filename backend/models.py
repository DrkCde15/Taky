from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, create_engine, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# MySQL configuration from .env
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE", "tasky_db")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(20), default="member")
    avatar = Column(String(255))
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    owner_id = Column(Integer, ForeignKey("users.id"))
    tasks = relationship("Task", back_populates="team")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    status = Column(String(50), default="in_progress")
    priority = Column(String(20), default="medium") # low, medium, high
    tags = Column(String(255), default="") # comma separated tags
    due_date = Column(DateTime, nullable=True)
    time_spent = Column(Float, default=0.0)
    user_id = Column(Integer, ForeignKey("users.id"))
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner = relationship("User", back_populates="tasks")
    team = relationship("Team", back_populates="tasks")
    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan")
    history = relationship("TaskHistory", back_populates="task", cascade="all, delete-orphan")
    files = relationship("TaskFile", back_populates="task", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    task = relationship("Task", back_populates="comments")
    user = relationship("User")

class TaskHistory(Base):
    __tablename__ = "task_history"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(255)) # e.g. "Status changed from X to Y"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    task = relationship("Task", back_populates="history")
    user = relationship("User")

class TaskFile(Base):
    __tablename__ = "task_files"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    filename = Column(String(255))
    file_path = Column(String(255))
    file_type = Column(String(100))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    task = relationship("Task", back_populates="files")


Base.metadata.create_all(bind=engine)
