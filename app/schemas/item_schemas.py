from pydantic import BaseModel
from typing import Optional
from datetime import date as DateType
from datetime import date



class CreateLostItem(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int
    location: str
    date: date
    image: Optional[str] = None
    
class UpdateLostItem(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    location: Optional[str] = None
    date: Optional[DateType] = None   
    image: Optional[str] = None    
    
class CreateFoundItem(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int
    location: str
    date: date
    image: Optional[str] = None    
    
class UpdateFoundItemSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    location: Optional[str] = None
    date: Optional[DateType] = None
    image: Optional[str] = None    