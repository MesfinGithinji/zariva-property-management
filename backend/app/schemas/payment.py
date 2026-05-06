from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.payment import PaymentMethod, PaymentStatus


class PaymentCreate(BaseModel):
    lease_id: int
    amount: float
    payment_date: date
    month_for: str
    method: PaymentMethod = PaymentMethod.mpesa
    reference: Optional[str] = None


class PaymentOut(BaseModel):
    id: int
    lease_id: int
    tenant_id: int
    amount: float
    payment_date: date
    month_for: str
    method: PaymentMethod
    reference: Optional[str]
    status: PaymentStatus
    created_at: datetime
    tenant_name: Optional[str] = None
    property_name: Optional[str] = None
    unit_number: Optional[str] = None

    class Config:
        from_attributes = True
