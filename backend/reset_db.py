import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import engine, Base
from models import models

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset completed successfully!")
