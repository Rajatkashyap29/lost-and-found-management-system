from fastapi import APIRouter,Depends,HTTPException,Header,Query
from sqlalchemy.orm import Session
from jose import jwt,JWTError
from ..config.database import get_db
from ..config.settings import settings
from ..models.item_model import Item,Category
from ..schemas.item_schemas import CreateLostItem, UpdateFoundItemSchema, UpdateLostItem,CreateFoundItem
from ..models.user_model import User
from ..models.item_model import Item



# =============================================================== LOST APIS =========================================================================

def ReportLostItem(ReportItem:CreateLostItem,Database:Session=Depends(get_db),auth:str = Header(...)):
    
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
    
    
    user  = Database.query(User).filter(User.email == email).first()

    if not user :
        raise HTTPException(
            detail="USER NOT FOUND",
            status_code=404
        )
    
        
    category = Database.query(Category).filter(Category.id == ReportItem.category_id).first()
    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category Not Found"
        )
    
    
    new_item = Item(
        user_id=user.id,
        category_id=ReportItem.category_id,
        title=ReportItem.title,
        description=ReportItem.description,
        location=ReportItem.location,
        date=ReportItem.date,
        image=ReportItem.image,
        item_type="LOST",
        status="ACTIVE"
    )  
    
    Database.add(new_item)
    Database.commit()
    Database.refresh(new_item)

    return {
        "message": "Lost Item Reported Successfully",
        "item": new_item
    } 



def ViewMyLostItem(page:int = Query(1,ge=1),limit:int = Query(10,ge=1,le=10) ,Database:Session = Depends(get_db),auth:str = Header(...)):
    
   token =  auth.replace("Bearer ", "")
   
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
   
   user = Database.query(User).filter(User.email == email).first()
   
   if not user:
       raise HTTPException(
           status_code=404,
           detail="User Not Found"
       )
   
   
   skip = (page-1)* limit
   item = Database.query(Item).filter(Item.user_id == user.id and Item.item_type == "LOST").offset(skip).limit(limit).all()
   if not item:
       raise HTTPException(
           status_code=404,
           detail="Item Not Found"
       )   
        
    
   return{
        "status":True,
        "message":"Item Fetched SucesFully",
        "item":item
    } 

def ViewSpecificItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
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
    
    if not user :
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )
    
    item = Database.query(Item).filter(
        Item.id == item_id,
        Item.user_id == user.id,
        Item.item_type == "LOST"
    ).first()
    
    if not item :
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )    
    
    return{
        "status":True,
        "message":"Item Fetched SucessFully",
        "Item":item
    }    

def UpdateSpecificLostItem(item_id: int,update_item: UpdateLostItem,Database: Session = Depends(get_db),auth: str = Header(...)):
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
    
    if not user :
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )  
    
    item = Database.query(Item).filter(Item.id == item_id,Item.user_id == user.id,Item.item_type == "LOST").first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Lost Item Not Found"
        )
        
    if update_item.title is not None:
       item.title = update_item.title

    if update_item.description is not None:
        item.description = update_item.description

    if update_item.category_id is not None:

        category = Database.query(Category).filter(
            Category.id == update_item.category_id
        ).first()

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category Not Found"
            )

        item.category_id = update_item.category_id

    if update_item.location is not None:
        item.location = update_item.location

    if update_item.date is not None:
        item.date = update_item.date

    if update_item.image is not None:
        item.image = update_item.image
        
    Database.commit()
    Database.refresh(item)

    return {
        "status": True,
        "message": "Lost Item Updated Successfully",
        "item": item
    }    
    
def DeleteLostItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
    token = auth.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except JWTError :
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expire Token"
        )   
        
    email = payload["sub"]      
    
    user = Database.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code= 404,
            detail="User Not Found"
        )
    
    item = Database.query(Item).filter(Item.id == item_id,Item.user_id == user.id ,Item.item_type == "LOST").first()
    
    if not item :
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )     
    
    Database.delete(item)
    Database.commit()
    
    return{
        "Status":True,
        "message":"Item Deleted Sucessfully"
    }    


# =============================================================== FOUND APIS =========================================================================    

def ReportFoundItem(ReportItem:CreateFoundItem,Database:Session = Depends(get_db),auth:str = Header(...)):
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
            detail="Invalid Or Expire Token"
        )
    
    email = payload["sub"]
    
    user = Database.query(User).filter(User.email == email).first()
    
    if not user :
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )
    
    category = Database.query(Category).filter(Category.id == ReportItem.category_id).first()
    
    if not category:
            raise HTTPException(
                status_code=404,
                detail="Category Not Found"
            )   
            
    item_found = Item(
        user_id=user.id,
        category_id=ReportItem.category_id,
        title=ReportItem.title,
        description=ReportItem.description,
        location=ReportItem.location,
        date=ReportItem.date,
        image=ReportItem.image,
        item_type="FOUND",
        status="ACTIVE"
    )         
    
    Database.add(item_found)
    Database.commit()
    Database.refresh(item_found)
    
    return {
        "message": "Found Item Reported Successfully",
        "item": item_found
        } 
            


def ViewMyFoundItem(page:int = Query(1,ge=1),limit:int = Query(10, ge=1 ,le=100) ,Database:Session = Depends(get_db),auth:str = Header(...)):
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
    
    user = Database.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )   
   
    skip = (page - 1)*limit 
    items = Database.query(Item).filter(Item.user_id == user.id,Item.item_type == "FOUND").offset(skip).limit(limit).all()
    
    if not items:
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )  
    
    return{
        "Status":True,
        "message":"Items Fetched SucessFully",
        "items":items
    }   

def ViewSpecificFoundItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
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
    
    user = Database.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )  
    
    item = Database.query(Item).filter(Item.id == item_id,Item.user_id == user.id,Item.item_type == "FOUND").first()
    
    
    if not item:
      raise HTTPException(
        status_code=404,
        detail="Item Not Found"
        )
    
    return{
            "Status":True,
            "message":"Item Fetched SucessFully",
            "items":item
        }  

def UpdateSpecificFoundItem(item_id: int,update_item:UpdateFoundItemSchema,Database: Session = Depends(get_db),auth: str = Header(...)):
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
    
    if not user :
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )  
    
    item = Database.query(Item).filter(Item.id == item_id,Item.user_id == user.id,Item.item_type == "FOUND").first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Found Item Not Found"
        )
   
    if update_item.title is not None:
        item.title = update_item.title

    if update_item.description is not None:
        item.description = update_item.description

    if update_item.category_id is not None:

        category = Database.query(Category).filter(
            Category.id == update_item.category_id
        ).first()

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category Not Found"
            )

        item.category_id = update_item.category_id

    if update_item.location is not None:
        item.location = update_item.location

    if update_item.date is not None:
        item.date = update_item.date

    if update_item.image is not None:
        item.image = update_item.image
        
    Database.commit()
    Database.refresh(item)

    return {
        "status": True,
        "message": "Found Item Updated Successfully",
        "item": item
    } 

def DelteParticularFoundItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
    token = auth.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except JWTError :
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expire Token"
        )   
        
    email = payload["sub"]      
    
    user = Database.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code= 404,
            detail="User Not Found"
        )
    
    item = Database.query(Item).filter(Item.id == item_id,Item.user_id == user.id ,Item.item_type == "FOUND").first()
    
    if not item :
        raise HTTPException(
            status_code=404,
            detail="Item Not Found"
        )     
    
    Database.delete(item)
    Database.commit()
    
    return{
        "Status":True,
        "message":"Item Deleted Sucessfully"
    }    
    
               
def ViewAllItems(page: int,limit: int,Database: Session):
    skip = (page - 1) * limit

    items = Database.query(Item)\
        .offset(skip)\
        .limit(limit)\
        .all()

    return {
        "status": True,
        "page": page,
        "limit": limit,
        "items": items
    }

# =========================================================Cateories============================================================================         
def FetchAllCategories(Database:Session = Depends(get_db)):
  categories = Database.query(Category).all()

  return {
        "status": True,
        "message": "Successfully Fetched All Categories",
        "categories": categories
    }
        
        