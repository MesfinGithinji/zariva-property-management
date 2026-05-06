from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.property import Property, PropertyStatus
from app.models.unit import Unit, UnitStatus
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyOut
from app.dependencies import get_current_user, require_landlord

router = APIRouter(prefix="/properties", tags=["Properties"])


def enrich_property(prop: Property) -> PropertyOut:
    units = prop.units or []
    total = len(units)
    occupied = sum(1 for u in units if u.status == UnitStatus.occupied)
    monthly_income = sum(u.rent_amount for u in units if u.status == UnitStatus.occupied)
    rate = round((occupied / total * 100), 1) if total > 0 else 0.0
    out = PropertyOut.model_validate(prop)
    out.total_units = total
    out.occupied_units = occupied
    out.occupancy_rate = rate
    out.monthly_income = monthly_income
    return out


@router.get("", response_model=List[PropertyOut])
def list_properties(
    status: Optional[PropertyStatus] = None,
    type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    q = db.query(Property).filter(Property.owner_id == current_user.id)
    if status:
        q = q.filter(Property.status == status)
    if type:
        q = q.filter(Property.type == type)
    properties = q.offset(skip).limit(limit).all()
    return [enrich_property(p) for p in properties]


@router.post("", response_model=PropertyOut, status_code=status.HTTP_201_CREATED)
def create_property(
    payload: PropertyCreate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    prop = Property(**payload.model_dump(), owner_id=current_user.id)
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return enrich_property(prop)


@router.get("/{property_id}", response_model=PropertyOut)
def get_property(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return enrich_property(prop)


@router.patch("/{property_id}", response_model=PropertyOut)
def update_property(
    property_id: int,
    payload: PropertyUpdate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    prop = db.query(Property).filter(
        Property.id == property_id, Property.owner_id == current_user.id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(prop, key, value)
    db.commit()
    db.refresh(prop)
    return enrich_property(prop)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: int,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    prop = db.query(Property).filter(
        Property.id == property_id, Property.owner_id == current_user.id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop)
    db.commit()
