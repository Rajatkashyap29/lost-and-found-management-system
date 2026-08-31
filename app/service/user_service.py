from fastapi import APIRouter,Depends,HTTPException,Header
from sqlalchemy.orm import Session
from jose import jwt,JWTError


from ..config.database import get_db
from ..auth.token import generate_access_token
from ..schemas.user_schemas import UserRegister,UserLogin,UpdateProfile
from ..config.settings import settings
from ..models.user_model import User

from ..auth.hash_pwd import pwd_context

def RegisterUser(user:UserRegister,Database:Session = Depends(get_db)):
    existing_user = Database.query(User).filter(User.email == user.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="EMAIL NOt FOUND"
        )
    
    existing_erp = Database.query(User).filter(
    User.erp_id == user.erp_id
    ).first()
    
    if existing_erp:
        raise HTTPException(
        status_code=409,
        detail="ERP ID already registered"
    )
        
    existing_phone = Database.query(User).filter(
    User.phone_number == user.phone_number
    ).first()   
    
    if existing_phone:
     raise HTTPException(
        status_code=409,
        detail="Phone number already registered."
    ) 

                
    
    hash_pwd = pwd_context.hash(user.password)
    
    add_new_user = User(
    erp_id=user.erp_id,
    name=user.name,
    email=user.email,
    password=hash_pwd,
    phone_number=user.phone_number,
    
    )
    
    Database.add(add_new_user)
    Database.commit()
    Database.refresh(add_new_user)
    
    return{
        "message":"User Registerd Sucessfullly",
        "user":add_new_user
    }

def LoginUser(user:UserLogin,Database:Session = Depends(get_db)):
    existing_user = Database.query(User).filter(User.email == user.email ).first()
    
    if not existing_user :
        raise HTTPException (
            status_code=404,
            detail="USER NOT FOUND"
        )   
    
    if not pwd_context.verify(user.password,existing_user.password):
        raise HTTPException(
            detail="Can`t Login Incorrect Password Enter",
            status_code=401
        )
        
    token = generate_access_token(
        data={
        "sub": existing_user.email,
        "user_id": existing_user.id,
        "role": existing_user.role
        }
    )        
    
    
    return{
        "message":"Login Sucessfully",
        "access_token": token,
        "token_type": "bearer"
    }
def ViewOwnProfile(Database: Session, auth: str):

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
            detail="Invalid or expired token"
        )

    email = payload["sub"]

    user = Database.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "User fetched successfully",
        "user": {
            "id": user.id,
            "erp_id": user.erp_id,
            "name": user.name,
            "email": user.email,
            "phone_number": user.phone_number,
            "profile_image": user.profile_image,
            "role": user.role,
            "is_active": user.is_active
        }
    }

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError

def UpdateOwnProfile(
    update_user: UpdateProfile,
    Database: Session = Depends(get_db),
    auth: str = Header(...)
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
            detail="Invalid or Expired Token"
        )

    email = payload["sub"]

    user = Database.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    
    if update_user.name:
        user.name = update_user.name

    
    if update_user.phone_number:

        already_exists = Database.query(User).filter(
            User.phone_number == update_user.phone_number,
            User.id != user.id
        ).first()

        if already_exists:
            raise HTTPException(
                status_code=400,
                detail="Phone Number Already Exists"
            )

        user.phone_number = update_user.phone_number

    
    Database.commit()
    Database.refresh(user)

    return {
        "message": "Profile Updated Successfully",
        "user": user
    }