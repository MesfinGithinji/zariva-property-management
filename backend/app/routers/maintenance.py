from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.maintenance import MaintenanceRequest, MaintenanceStatus, MaintenancePriority
from app.models.unit import Unit
from app.models.property import Property
from app.models.user import User
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate, MaintenanceOut
from app.dependencies import get_current_user, require_landlord

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


def enrich_request(req: MaintenanceRequest, db: Session) -> MaintenanceOut:
    out = MaintenanceOut.model_validate(req)
    if req.tenant:
        out.tenant_name = req.tenant.full_name
    if req.unit:
        out.unit_number = req.unit.unit_number
        if req.unit.property:
            out.property_name = req.unit.property.name
    return out


@router.get("", response_model=List[MaintenanceOut])
def list_requests(
    status_filter: Optional[MaintenanceStatus] = Query(None, alias="status"),
    priority: Optional[MaintenancePriority] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role.value == "landlord":
        q = (
            db.query(MaintenanceRequest)
            .join(Unit, MaintenanceRequest.unit_id == Unit.id)
            .join(Property, Unit.property_id == Property.id)
            .filter(Property.owner_id == current_user.id)
        )
    else:
        q = db.query(MaintenanceRequest).filter(
            MaintenanceRequest.tenant_id == current_user.id
        )

    if status_filter:
        q = q.filter(MaintenanceRequest.status == status_filter)
    if priority:
        q = q.filter(MaintenanceRequest.priority == priority)

    requests = q.order_by(MaintenanceRequest.submitted_date.desc()).offset(skip).limit(limit).all()
    return [enrich_request(r, db) for r in requests]


@router.post("", response_model=MaintenanceOut, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: MaintenanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    unit = db.query(Unit).filter(Unit.id == payload.unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    req = MaintenanceRequest(**payload.model_dump(), tenant_id=current_user.id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return enrich_request(req, db)


@router.patch("/{request_id}", response_model=MaintenanceOut)
def update_request(
    request_id: int,
    payload: MaintenanceUpdate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(req, key, value)
    db.commit()
    db.refresh(req)
    return enrich_request(req, db)


@router.get("/stats", response_model=dict)
def maintenance_stats(
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    base = (
        db.query(MaintenanceRequest)
        .join(Unit, MaintenanceRequest.unit_id == Unit.id)
        .join(Property, Unit.property_id == Property.id)
        .filter(Property.owner_id == current_user.id)
    )
    return {
        "pending":      base.filter(MaintenanceRequest.status == MaintenanceStatus.pending).count(),
        "in_progress":  base.filter(MaintenanceRequest.status == MaintenanceStatus.in_progress).count(),
        "completed":    base.filter(MaintenanceRequest.status == MaintenanceStatus.completed).count(),
        "high_priority": base.filter(MaintenanceRequest.priority == MaintenancePriority.high).count(),
    }
