from fastapi import APIRouter,Depends,Header,Query
from sqlalchemy.orm import Session
from ..config.database import get_db

from ..schemas.item_schemas import CreateLostItem,UpdateLostItem,CreateFoundItem,UpdateFoundItemSchema
from ..service.item_service import (
    ReportLostItem,
    ViewMyLostItem,
    ViewSpecificItem,
    UpdateSpecificLostItem,
    DeleteLostItem,
    ReportFoundItem,
    ViewMyFoundItem,
    ViewSpecificFoundItem,
    UpdateSpecificFoundItem,
    DelteParticularFoundItem,
    ViewAllItems,
    FetchAllCategories
    )



router = APIRouter(tags=["Lost & Found Management System"])

# ============================================================= LOST ROUTES ==============================================================

@router.post('/lost-item')
def lost_item(ReportItem:CreateLostItem,Database:Session=Depends(get_db),auth:str = Header(...)):
    return ReportLostItem(ReportItem,Database,auth)

@router.get('/see-lost-item')
def ViewItem(page: int = Query(1, ge=1),limit: int = Query(10, ge=1, le=100),Database:Session = Depends(get_db),auth:str = Header(...)):
    return ViewMyLostItem(page,limit,Database,auth)

@router.get('/see-lost-item/{item_id}')
def viewdingleitem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
    return ViewSpecificItem(item_id,Database,auth)

@router.put("/lost-item/{item_id}")
def Updateitem (item_id: int,update_item: UpdateLostItem,Database: Session = Depends(get_db),auth: str = Header(...)):
    return UpdateSpecificLostItem(item_id,update_item,Database,auth)

@router.delete("/lost-item/{item_id}")
def DelteItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
    return DeleteLostItem(item_id,Database,auth)

# =============================================================== FOUND ROUTES =========================================================================

@router.post('/found-item')
def FoundItem(ReportItem:CreateFoundItem,Database:Session = Depends(get_db),auth:str = Header(...)):
    return ReportFoundItem(ReportItem,Database,auth)

@router.get('/see-found-item')
def viewFound(page:int = Query(1,ge=1),limit:int = Query(10 , ge=1 ,le=100),Database:Session = Depends(get_db),auth:str = Header(...)):
    return ViewMyFoundItem(page,limit,Database,auth)

@router.get('/see-found-item/{item_id}')
def ViewSpecifItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
    return ViewSpecificFoundItem(item_id,Database,auth)

@router.put('/found-item/{item_id}')
def UpdateFoundItem(item_id: int,update_item:UpdateFoundItemSchema,Database: Session = Depends(get_db),auth: str = Header(...)):
    return UpdateSpecificFoundItem(item_id,update_item,Database,auth)

@router.delete('/found-item/{item_id}')
def DelteFoundItem(item_id:int,Database:Session = Depends(get_db),auth:str = Header(...)):
    return DelteParticularFoundItem(item_id,Database,auth)

@router.get('/items')
def GetAllItems(page:int = Query(1, ge=1),limit:int = Query(10,ge=10,le=100),Database:Session = Depends(get_db)):
    return ViewAllItems(page, limit, Database)

@router.get('/categories')
def GetAllCategories(Database:Session = Depends(get_db)):
    return FetchAllCategories(Database)