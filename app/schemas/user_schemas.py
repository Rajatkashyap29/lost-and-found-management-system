from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegister(BaseModel):
    erp_id: int
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)
    phone_number: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)
    
class UpdateProfile(BaseModel):
    name:Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=50
    )   
    phone_number:Optional[str] = Field(
        default=None
    )