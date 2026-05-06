from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.lease import Lease, LeaseStatus
from app.models.payment import Payment, PaymentStatus
from app.schemas.auth import UserOut
from app.dependencies import require_landlord

router = APIRouter(prefix="/tenants", tags=["Tenants"])


class TenantDetail(UserOut):
    lease_status: Optional[str] = None
    payment_status: Optional[str] = None
    monthly_rent: Optional[float] = None
    balance: Optional[float] = None
    property_name: Optional[str] = None
    unit_number: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[TenantDetail])
def list_tenants(
    search: Optional[str] = None,
    lease_status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    # Get all tenants who have leases under this landlord's properties
    from app.models.unit import Unit
    from app.models.property import Property

    subquery = (
        db.query(Lease.tenant_id)
        .join(Unit, Lease.unit_id == Unit.id)
        .join(Property, Unit.property_id == Property.id)
        .filter(Property.owner_id == current_user.id)
        .subquery()
    )

    q = db.query(User).filter(
        User.id.in_(subquery),
        User.role == UserRole.tenant,
    )
    if search:
        q = q.filter(User.full_name.ilike(f"%{search}%"))

    tenants = q.offset(skip).limit(limit).all()

    results = []
    for tenant in tenants:
        # Get active lease
        active_lease = (
            db.query(Lease)
            .join(Unit, Lease.unit_id == Unit.id)
            .join(Property, Unit.property_id == Property.id)
            .filter(
                Lease.tenant_id == tenant.id,
                Property.owner_id == current_user.id,
                Lease.status.in_([LeaseStatus.active, LeaseStatus.ending]),
            )
            .first()
        )

        detail = TenantDetail(
            id=tenant.id,
            email=tenant.email,
            full_name=tenant.full_name,
            phone=tenant.phone,
            role=tenant.role,
            is_active=tenant.is_active,
            profile_image=tenant.profile_image,
        )

        if active_lease:
            detail.lease_status = active_lease.status.value
            detail.monthly_rent = active_lease.monthly_rent

            # Check payment status this month
            from datetime import date
            today = date.today()
            current_month = today.strftime("%B %Y")
            paid_this_month = db.query(Payment).filter(
                Payment.lease_id == active_lease.id,
                Payment.month_for == current_month,
                Payment.status == PaymentStatus.completed,
            ).first()

            detail.payment_status = "paid" if paid_this_month else "overdue"
            detail.balance = 0 if paid_this_month else active_lease.monthly_rent

            # Property and unit
            unit = db.query(Unit).filter(Unit.id == active_lease.unit_id).first()
            if unit:
                detail.unit_number = unit.unit_number
                prop = db.query(Property).filter(Property.id == unit.property_id).first()
                if prop:
                    detail.property_name = prop.name

        results.append(detail)

    return results


@router.get("/{tenant_id}", response_model=TenantDetail)
def get_tenant(
    tenant_id: int,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    tenant = db.query(User).filter(User.id == tenant_id, User.role == UserRole.tenant).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant
