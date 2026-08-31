from sqlalchemy.orm import Session
from jose import jwt,JWTError
from ..config.database import get_db
from ..config.settings import settings
from ..models.claim_model import Claim
from fastapi import APIRouter,Depends,HTTPException,Header,Query
from ..models.user_model import User
from ..models.item_model import Item


def GetAdmin(
    Database: Session,
    auth: str
):

    token = auth.replace("Bearer ", "")

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Or Expired Token"
        )

    email = payload["sub"]

    user = Database.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    if user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin Access Required"
        )

    return user


def GetAllUsers(
    page: int,
    limit: int,
    Database: Session,
    auth: str
):

    GetAdmin(Database, auth)

    skip = (page - 1) * limit

    users = Database.query(User)\
        .offset(skip)\
        .limit(limit)\
        .all()

    if not users:
        raise HTTPException(
            status_code=404,
            detail="No Users Found"
        )

    return {
        "status": True,
        "message": "Users Fetched Successfully",
        "users": users
    }
    
    
def GetAllItems(
    page: int,
    limit: int,
    Database: Session,
    auth: str
):

    GetAdmin(Database, auth)

    skip = (page - 1) * limit

    items = Database.query(Item)\
        .offset(skip)\
        .limit(limit)\
        .all()

    if not items:
        raise HTTPException(
            status_code=404,
            detail="No Items Found"
        )

    return {
        "status": True,
        "message": "Items Fetched Successfully",
        "items": items
    }
    

def GetAllClaims(
    page: int,
    limit: int,
    Database: Session,
    auth: str
):

    GetAdmin(Database, auth)

    skip = (page - 1) * limit

    claims = Database.query(Claim)\
        .offset(skip)\
        .limit(limit)\
        .all()

    if not claims:
        raise HTTPException(
            status_code=404,
            detail="No Claims Found"
        )

    return {
        "status": True,
        "message": "Claims Fetched Successfully",
        "claims": claims
    }        