from .settings import settings
from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy import create_engine

Base = declarative_base()
engine = create_engine(settings.DB_CONNECTION)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()    
