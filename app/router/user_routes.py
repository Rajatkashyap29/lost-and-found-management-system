from fastapi import APIRouter,Depends,Header
from sqlalchemy.orm import Session


from ..service.user_service import RegisterUser,LoginUser,ViewOwnProfile,UpdateOwnProfile
from ..config.database import get_db
from ..schemas.user_schemas import UserRegister,UserLogin,UpdateProfile


router = APIRouter(tags=["Lost & Found Management System"])


@router.post('/registeruser')
def adduser(user:UserRegister ,Database:Session = Depends(get_db)):
    return RegisterUser(user,Database)

@router.post('/login')
def loginuser(user:UserLogin,Database:Session = Depends(get_db)):
    return LoginUser(user,Database)

@router.get('/me')
def MyProfile(Database:Session = Depends(get_db),auth:str = Header(...)):
    return ViewOwnProfile(Database,auth)

@router.put('/Update-profile')
def Update(update_user:UpdateProfile,Database:Session = Depends(get_db),auth:str = Header(...)):
    return UpdateOwnProfile(update_user,Database,auth)
    