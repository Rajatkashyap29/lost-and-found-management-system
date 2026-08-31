
from sqlalchemy.orm import Session
from jose import jwt,JWTError
from ..config.database import get_db
from ..config.settings import settings
from ..models.claim_model import Claim
from fastapi import APIRouter,Depends,HTTPException,Header,Query
from ..models.user_model import User
from ..models.item_model import Item



def ReportClaim(
    item_id: int,
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

    
    item = Database.query(Item).filter(
        Item.id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )

    
    if item.item_type != "FOUND":
        raise HTTPException(
            status_code=400,
            detail="Only Found Items Can Be Claimed"
        )

    
    if item.user_id == user.id:
        raise HTTPException(
            status_code=400,
            detail="You Cannot Claim Your Own Item"
        )

    
    existing_claim = Database.query(Claim).filter(
        Claim.item_id == item_id,
        Claim.user_id == user.id
    ).first()

    if existing_claim:
        raise HTTPException(
            status_code=400,
            detail="You Have Already Claimed This Item"
        )

    
    new_claim = Claim(
        item_id=item_id,
        user_id=user.id,
        status="PENDING"
    )

    Database.add(new_claim)
    Database.commit()
    Database.refresh(new_claim)

    return {
        "status": True,
        "message": "Item Claimed Successfully",
        "claim": new_claim
    }
    
def GetItemClaims(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
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
            detail="Invalid Or Expired token"
        )  
    email = payload["sub"]     
    
    user = Database.query(User).filter(User.email == email).first()
    if not user :
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )
    
    item = Database.query(Item).filter(
        Item.id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )
    
    if item.item_type != "FOUND":
        raise HTTPException(
            status_code=400,
            detail="Claims Are Only Available For Found Items"
        )
        
    if item.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You Are Not The Owner Of This Item"
        )
        
    if item.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You Are Not The Owner Of This Item"
        )
        
    claims = Database.query(Claim).filter(
        Claim.item_id == item_id
    ).all()

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

def GetMyClaims(
    page: int,
    limit: int,
    Database: Session,
    auth: str
):

    # 1. Token
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

    # 2. Logged-in user
    email = payload["sub"]

    user = Database.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    # 3. Pagination
    skip = (page - 1) * limit

    # 4. User ke claims
    claims = Database.query(Claim).filter(
        Claim.user_id == user.id
    ).offset(skip).limit(limit).all()

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
 
def AcceptClaim(
    claim_id: int,
    Database: Session,
    auth: str
):

    # Token
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

    # User
    email = payload["sub"]

    user = Database.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    # Claim
    claim = Database.query(Claim).filter(
        Claim.id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim Not Found"
        )

    # Item
    item = Database.query(Item).filter(
        Item.id == claim.item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )

    # Owner check
    if item.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You Are Not The Owner Of This Item"
        )

    # Already accepted/rejected?
    if claim.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Claim Already Processed"
        )

    # Accept current claim
    claim.status = "ACCEPTED"

    # Item status
    item.status = "CLAIMED"

    # Reject other pending claims
    other_claims = Database.query(Claim).filter(
        Claim.item_id == item.id,
        Claim.id != claim.id,
        Claim.status == "PENDING"
    ).all()

    for c in other_claims:
        c.status = "REJECTED"

    Database.commit()

    return {
        "status": True,
        "message": "Claim Accepted Successfully"
    }                         

def RejectClaim(
    claim_id: int,
    Database: Session,
    auth: str
):

    # Token
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

    # Logged-in user
    email = payload["sub"]

    user = Database.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    # Claim
    claim = Database.query(Claim).filter(
        Claim.id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim Not Found"
        )

    # Item
    item = Database.query(Item).filter(
        Item.id == claim.item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )

    # Owner check
    if item.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You Are Not The Owner Of This Item"
        )

    # Claim already processed?
    if claim.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Claim Already Processed"
        )

    # Reject claim
    claim.status = "REJECTED"

    Database.commit()

    return {
        "status": True,
        "message": "Claim Rejected Successfully"
    }    

def DeleteClaim(
    claim_id: int,
    Database: Session,
    auth: str
):

    # Token
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

    # Logged-in user
    email = payload["sub"]

    user = Database.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    # Claim
    claim = Database.query(Claim).filter(
        Claim.id == claim_id,
        Claim.user_id == user.id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim Not Found"
        )

    # Only pending claim can be cancelled
    if claim.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Only Pending Claims Can Be Cancelled"
        )

    # Delete
    Database.delete(claim)
    Database.commit()

    return {
        "status": True,
        "message": "Claim Cancelled Successfully"
    }    