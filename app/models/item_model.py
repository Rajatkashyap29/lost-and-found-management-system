from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Date,
    DateTime,
)
from ..config.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_type = Column(String, nullable=False)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("LFuser.id"), nullable=False)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=False)

    date = Column(Date, nullable=False)

    image = Column(String, nullable=True)

    item_type = Column(String, nullable=False)

    status = Column(String, nullable=False, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)