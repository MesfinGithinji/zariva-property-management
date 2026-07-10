import random
import string
from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import require_landlord, require_tenant
from app.models.user import User
from app.models.property import Property
from app.models.unit import Unit, UnitStatus
from app.models.lease import Lease, LeaseStatus
from app.models.join_request import JoinRequest
from app.models.consent import RequestStatus
from app.schemas.join_request import (
    PropertySearchOut, JoinRequestCreate, JoinRequestApprove,
    JoinRequestDecline, JoinRequestOut,
)

router = APIRouter(prefix="/join-requests", tags=["Join Requests"])


def _ref() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ZAP-JOIN-{date.today().strftime('%Y%m%d')}-{suffix}"


def _enrich(req: JoinRequest, db: Session) -> JoinRequestOut:
    out = JoinRequestOut.model_validate(req)
    if req.tenant:
        out.tenant_name = req.tenant.full_name
        out.tenant_email = req.tenant.email
    if req.property:
        out.property_name = req.property.name
    if req.unit_id:
        unit = db.query(Unit).filter(Unit.id == req.unit_id).first()
        if unit:
            out.unit_number = unit.unit_number
    return out


# ─── Property search (tenant-facing discovery) ───────────────────────────────

@router.get("/properties/search", response_model=List[PropertySearchOut])
def search_properties(
    q: str = Query("", description="Property name or landlord email"),
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    """Find properties by name or by the owning landlord's email.

    Deliberately not a full public dump: an empty query returns nothing, so a
    tenant must know something about the property or landlord to find it.
    """
    term = q.strip()
    if not term:
        return []

    query = db.query(Property).join(User, Property.owner_id == User.id)
    like = f"%{term}%"
    query = query.filter(
        (Property.name.ilike(like))
        | (Property.location.ilike(like))
        | (User.email.ilike(like))
    )
    properties = query.limit(20).all()

    results = []
    for p in properties:
        results.append(
            PropertySearchOut(
                id=p.id,
                name=p.name,
                location=p.location,
                landlord_name=p.owner.full_name if p.owner else None,
            )
        )
    return results


# ─── Tenant-facing ───────────────────────────────────────────────────────────

@router.post("", response_model=JoinRequestOut, status_code=status.HTTP_201_CREATED)
def create_join_request(
    payload: JoinRequestCreate,
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    prop = db.query(Property).filter(Property.id == payload.property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    # Already linked to a lease?
    active_lease = (
        db.query(Lease)
        .filter(
            Lease.tenant_id == current_user.id,
            Lease.status.in_([LeaseStatus.active, LeaseStatus.ending]),
        )
        .first()
    )
    if active_lease:
        raise HTTPException(status_code=409, detail="You are already linked to a property")

    # Existing pending request?
    pending = (
        db.query(JoinRequest)
        .filter(
            JoinRequest.tenant_id == current_user.id,
            JoinRequest.status == RequestStatus.pending,
        )
        .first()
    )
    if pending:
        raise HTTPException(status_code=409, detail="You already have a pending join request")

    req = JoinRequest(
        reference_number=_ref(),
        tenant_id=current_user.id,
        property_id=payload.property_id,
        message=payload.message,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return _enrich(req, db)


@router.get("/me", response_model=List[JoinRequestOut])
def my_join_requests(
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    reqs = (
        db.query(JoinRequest)
        .filter(JoinRequest.tenant_id == current_user.id)
        .order_by(JoinRequest.created_at.desc())
        .all()
    )
    return [_enrich(r, db) for r in reqs]


# ─── Landlord-facing ─────────────────────────────────────────────────────────

@router.get("", response_model=List[JoinRequestOut])
def list_join_requests(
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    """All join requests targeting this landlord's properties only."""
    owned_property_ids = [
        p.id for p in db.query(Property.id).filter(Property.owner_id == current_user.id).all()
    ]
    if not owned_property_ids:
        return []
    reqs = (
        db.query(JoinRequest)
        .filter(JoinRequest.property_id.in_(owned_property_ids))
        .order_by(JoinRequest.created_at.desc())
        .all()
    )
    return [_enrich(r, db) for r in reqs]


def _load_owned_request(req_id: int, landlord: User, db: Session) -> JoinRequest:
    req = db.query(JoinRequest).filter(JoinRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Join request not found")
    prop = db.query(Property).filter(Property.id == req.property_id).first()
    if not prop or prop.owner_id != landlord.id:
        raise HTTPException(status_code=403, detail="Not your property")
    return req


@router.post("/{req_id}/approve", response_model=JoinRequestOut)
def approve_join_request(
    req_id: int,
    payload: JoinRequestApprove,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    req = _load_owned_request(req_id, current_user, db)
    if req.status != RequestStatus.pending:
        raise HTTPException(status_code=409, detail="Request has already been decided")

    # Unit must belong to this request's property and be vacant.
    unit = db.query(Unit).filter(Unit.id == payload.unit_id).first()
    if not unit or unit.property_id != req.property_id:
        raise HTTPException(status_code=400, detail="Unit does not belong to this property")
    if unit.status == UnitStatus.occupied:
        raise HTTPException(status_code=400, detail="Unit is already occupied")

    days_to_end = (payload.end_date - date.today()).days
    lease_status = LeaseStatus.ending if 0 < days_to_end <= 90 else LeaseStatus.active

    lease = Lease(
        unit_id=unit.id,
        tenant_id=req.tenant_id,
        monthly_rent=payload.monthly_rent,
        deposit=payload.deposit,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status=lease_status,
    )
    db.add(lease)
    unit.status = UnitStatus.occupied
    db.flush()  # get lease.id

    req.status = RequestStatus.approved
    req.unit_id = unit.id
    req.lease_id = lease.id
    req.decision_by = current_user.full_name
    req.decision_date = datetime.utcnow()

    db.commit()
    db.refresh(req)
    return _enrich(req, db)


@router.post("/{req_id}/decline", response_model=JoinRequestOut)
def decline_join_request(
    req_id: int,
    payload: JoinRequestDecline,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    req = _load_owned_request(req_id, current_user, db)
    if req.status != RequestStatus.pending:
        raise HTTPException(status_code=409, detail="Request has already been decided")

    req.status = RequestStatus.declined
    req.decline_reason = payload.decline_reason
    req.decision_by = current_user.full_name
    req.decision_date = datetime.utcnow()

    db.commit()
    db.refresh(req)
    return _enrich(req, db)
