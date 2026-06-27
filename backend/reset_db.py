import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from core.database import engine, Base
from models import models

print("Dropping all tables...")
with engine.connect() as conn:
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
    tables = ["notifications", "task_files", "task_history", "comments", "time_logs", "tasks", "projects", "team_members", "teams", "invite_tokens", "users"]
    for t in tables:
        try:
            conn.execute(text(f"DROP TABLE IF EXISTS {t};"))
        except Exception as e:
            print(f"Error dropping {t}: {e}")
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    conn.commit()

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset completed successfully!")
