from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Enum
)

from ..config.database import Base


class User(Base):
    __tablename__ = "LFuser"

    id = Column(Integer, primary_key=True, index=True)
    erp_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=True)
    profile_image = Column(String, nullable=True)
    role = Column(
        Enum("USER", "ADMIN", name="user_role"),
        default="USER",
        nullable=False
    )
    is_active = Column(Boolean, default=True)