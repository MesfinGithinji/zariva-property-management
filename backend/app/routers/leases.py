from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta
from app.core.database import get_db
from app.models.lease import Lease, LeaseStatus
from app.models.unit import Unit, UnitStatus
from app.models.user import User
from app.schemas.lease import LeaseCreate, LeaseUpdate, LeaseOut
from app.dependencies import get_current_user, require_landlord

router = APIRouter(prefix="/leases", tags=["Leases"])


def enrich_lease(lease: Lease, db: Session) -> LeaseOut:
    out = LeaseOut.model_validate(lease)
    if lease.tenant:
        out.tenant_name = lease.tenant.full_name
    if lease.unit:
        out.unit_number = lease.unit.unit_number
        if lease.unit.property:
            out.property_name = lease.unit.property.name
    return out


@router.get("", response_model=List[LeaseOut])
def list_leases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role.value == "landlord":
        from app.models.property import Property
        leases = (
            db.query(Lease)
            .join(Unit, Lease.unit_id == Unit.id)
            .join(Property, Unit.property_id == Property.id)
            .filter(Property.owner_id == current_user.id)
            .all()
        )
    else:
        leases = db.query(Lease).filter(Lease.tenant_id == current_user.id).all()
    return [enrich_lease(l, db) for l in leases]


@router.post("", response_model=LeaseOut, status_code=status.HTTP_201_CREATED)
def create_lease(
    payload: LeaseCreate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    # Check unit exists and is vacant
    unit = db.query(Unit).filter(Unit.id == payload.unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    if unit.status == UnitStatus.occupied:
        raise HTTPException(status_code=400, detail="Unit is already occupied")

    # Auto-set status based on end date
    days_to_end = (payload.end_date - date.today()).days
    lease_status = LeaseStatus.ending if 0 < days_to_end <= 90 else LeaseStatus.active

    lease = Lease(**payload.model_dump(), status=lease_status)
    db.add(lease)

    # Mark unit as occupied
    unit.status = UnitStatus.occupied
    db.commit()
    db.refresh(lease)
    return enrich_lease(lease, db)


@router.patch("/{lease_id}", response_model=LeaseOut)
def update_lease(
    lease_id: int,
    payload: LeaseUpdate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(lease, key, value)

    # If lease is terminated/expired, free up the unit
    if payload.status in [LeaseStatus.terminated, LeaseStatus.expired]:
        unit = db.query(Unit).filter(Unit.id == lease.unit_id).first()
        if unit:
            unit.status = UnitStatus.vacant

    db.commit()
    db.refresh(lease)
    return enrich_lease(lease, db)
