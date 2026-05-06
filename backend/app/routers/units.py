from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.unit import Unit
from app.models.property import Property
from app.models.user import User
from app.schemas.unit import UnitCreate, UnitUpdate, UnitOut
from app.dependencies import get_current_user, require_landlord

router = APIRouter(prefix="/units", tags=["Units"])


@router.get("/property/{property_id}", response_model=List[UnitOut])
def list_units(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    units = db.query(Unit).filter(Unit.property_id == property_id).all()
    return units


@router.post("", response_model=UnitOut, status_code=status.HTTP_201_CREATED)
def create_unit(
    payload: UnitCreate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    prop = db.query(Property).filter(
        Property.id == payload.property_id, Property.owner_id == current_user.id
    ).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    unit = Unit(**payload.model_dump())
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit


@router.patch("/{unit_id}", response_model=UnitOut)
def update_unit(
    unit_id: int,
    payload: UnitUpdate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(unit, key, value)
    db.commit()
    db.refresh(unit)
    return unit


@router.delete("/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unit(
    unit_id: int,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit)
    db.commit()
