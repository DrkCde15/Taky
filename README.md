# 🚀 Tasky - Full-Stack Task Management System

Tasky is a powerful, production-ready task management application built with a modern Full-Stack architecture. It features a stunning premium glassmorphism design and advanced tools for team collaboration and project analytics.

## ✨ Features

### 📋 Advanced Kanban Board
- **Dynamic Drag & Drop**: Smooth task organization using `@dnd-kit`.
- **Priority & Tags**: Categorize tasks with High/Medium/Low priority and custom labels.
- **Detailed Modals**: Tabbed interface for editing details, comments, history, and files.

### 📅 Calendar & Planning
- **Visual Schedule**: Track deadlines and task distribution in a dedicated calendar view.
- **Smart Markers**: Highlights days with high-priority tasks.

### 📊 Admin & Analytics
- **Manager Dashboard**: Real-time KPI cards (Total tasks, hours spent, blocked issues).
- **Interactive Charts**: Performance visualization using `Recharts` (Pie & Bar charts).
- **Member Management**: Role-based access control (RBAC) to manage team members.

### 🤝 Team Collaboration
- **Team Perspectives**: Choose between Admin or Member view upon login.
- **Invitation System**: Generate secure invite links for new members.
- **Communication**: Integrated comment system within each task.
- **Activity Log**: Complete history of status and priority changes.

### 📎 File Management
- **Attachments**: Support for uploading and downloading `.pdf`, `.csv`, `.xlsx`, `.docx`, `.json`, etc.
- **Safe Storage**: Managed backend file system for project documentation.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Zustand, TailwindCSS (Vanilla CSS logic), Recharts, Lucide Icons.
- **Backend**: FastAPI (Python), SQLAlchemy, MySQL, JWT Authentication, python-jose.
- **Design**: Premium Glassmorphism UI with custom CSS variables.

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pymysql python-multipart python-jose passlib cryptography python-dotenv

# Set up .env file
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password
# MYSQL_DATABASE=tasky_db
# SECRET_KEY=your_secret

# Run server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔐 Permissions
- **Admin**: Can create teams, manage members, view analytics, and delete tasks.
- **Member**: Can track their own tasks, add comments, upload files, and view the board.

## 📄 License
This project is for educational and professional demonstration purposes.
