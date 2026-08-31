from fastapi import APIRouter,Depends,Header,Query
from sqlalchemy.orm import Session

from app.router.item_routes import GetAllItems
from ..config.database import get_db
from ..service.admin_service import GetAllClaims, GetAllUsers








router = APIRouter(tags=["Lost & Found Management System"])

@router.get("/admin/users")
def ViewAllUsers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return GetAllUsers(page, limit, Database, auth)


@router.get("/admin/items")
def ViewAllItems(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return GetAllItems(page, limit, Database, auth)

@router.get("/admin/claims")
def ViewAllClaims(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return GetAllClaims(page, limit, Database, auth)