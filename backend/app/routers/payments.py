from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.payment import Payment
from app.models.lease import Lease
from app.models.unit import Unit
from app.models.property import Property
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentOut
from app.dependencies import get_current_user, require_landlord
import random, string

router = APIRouter(prefix="/payments", tags=["Payments"])


def generate_reference() -> str:
    return "ZRV" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


def enrich_payment(payment: Payment, db: Session) -> PaymentOut:
    out = PaymentOut.model_validate(payment)
    if payment.tenant:
        out.tenant_name = payment.tenant.full_name
    if payment.lease and payment.lease.unit:
        out.unit_number = payment.lease.unit.unit_number
        if payment.lease.unit.property:
            out.property_name = payment.lease.unit.property.name
    return out


@router.get("", response_model=List[PaymentOut])
def list_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role.value == "landlord":
        payments = (
            db.query(Payment)
            .join(Lease, Payment.lease_id == Lease.id)
            .join(Unit, Lease.unit_id == Unit.id)
            .join(Property, Unit.property_id == Property.id)
            .filter(Property.owner_id == current_user.id)
            .order_by(Payment.created_at.desc())
            .offset(skip).limit(limit)
            .all()
        )
    else:
        payments = (
            db.query(Payment)
            .filter(Payment.tenant_id == current_user.id)
            .order_by(Payment.created_at.desc())
            .offset(skip).limit(limit)
            .all()
        )
    return [enrich_payment(p, db) for p in payments]


@router.post("", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def create_payment(
    payload: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    lease = db.query(Lease).filter(Lease.id == payload.lease_id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")

    # Only the tenant on the lease or a landlord can record a payment
    if current_user.role.value == "tenant" and lease.tenant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your lease")

    ref = payload.reference or generate_reference()
    payment = Payment(
        **payload.model_dump(),
        tenant_id=lease.tenant_id,
        reference=ref,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return enrich_payment(payment, db)


@router.get("/summary", response_model=dict)
def payment_summary(
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    from sqlalchemy import func, extract
    from datetime import date

    today = date.today()
    month_payments = (
        db.query(func.sum(Payment.amount))
        .join(Lease, Payment.lease_id == Lease.id)
        .join(Unit, Lease.unit_id == Unit.id)
        .join(Property, Unit.property_id == Property.id)
        .filter(
            Property.owner_id == current_user.id,
            extract("month", Payment.payment_date) == today.month,
            extract("year", Payment.payment_date) == today.year,
        )
        .scalar() or 0
    )

    return {
        "monthly_collected": month_payments,
        "month": today.strftime("%B %Y"),
    }
