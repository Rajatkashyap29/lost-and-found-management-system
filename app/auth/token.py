from  jose import JWTError,jwt
from ..config.settings import settings
from datetime import datetime,timedelta

def generate_access_token(data:dict):
    to_encode = data.copy()
    
    expire = datetime.utcnow()+timedelta(minutes=30)
    to_encode.update({"exp": expire})
    
    token = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return token