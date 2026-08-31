from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    DateTime
)

from ..config.database import Base


class Claim(Base):

    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)

    item_id = Column(
        Integer,
        ForeignKey("items.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("LFuser.id"),
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="PENDING"
    )
    created_at = Column(DateTime,default=datetime.utcnow)
    updated_at = Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)