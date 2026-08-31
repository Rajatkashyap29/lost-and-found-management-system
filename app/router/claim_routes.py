from ..models.claim_model import Claim
from fastapi import APIRouter,Depends,Header,Query
from sqlalchemy.orm import Session
from ..config.database import get_db

from ..service.claim_servecies import ReportClaim,GetItemClaims,GetMyClaims,AcceptClaim,RejectClaim,DeleteClaim





router = APIRouter(tags=["Lost & Found Management System"])

@router.post("/claim/{item_id}")
def CreateClaim(
    item_id: int,
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
  return ReportClaim(item_id, Database, auth)


@router.get("/item/{item_id}/claims")
def ViewItemClaims(
    item_id: int,
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return GetItemClaims(item_id, Database, auth)


@router.get("/my-claims")
def ViewMyClaims(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=10),
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return GetMyClaims(page, limit, Database, auth)


@router.put("/claims/{claim_id}/accept")
def AcceptClaimRoute(
    claim_id: int,
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return AcceptClaim(claim_id, Database, auth)


@router.put("/claims/{claim_id}/reject")
def RejectClaimRoute(
    claim_id: int,
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return RejectClaim(claim_id, Database, auth)

@router.delete("/claims/{claim_id}")
def DeleteClaimRoute(
    claim_id: int,
    Database: Session = Depends(get_db),
    auth: str = Header(...)
):
    return DeleteClaim(claim_id, Database, auth)
