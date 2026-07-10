from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.consent import RequestStatus


class PropertySearchOut(BaseModel):
    """Minimal property info a tenant sees when searching for one to join."""
    id: int
    name: str
    location: str
    landlord_name: Optional[str] = None


class JoinRequestCreate(BaseModel):
    property_id: int
    message: Optional[str] = None


class JoinRequestApprove(BaseModel):
    unit_id: int
    monthly_rent: float
    deposit: float
    start_date: date
    end_date: date


class JoinRequestDecline(BaseModel):
    decline_reason: Optional[str] = None


class JoinRequestOut(BaseModel):
    id: int
    reference_number: str
    tenant_id: int
    property_id: int
    message: Optional[str] = None
    status: RequestStatus
    unit_id: Optional[int] = None
    lease_id: Optional[int] = None
    decision_by: Optional[str] = None
    decision_date: Optional[datetime] = None
    decline_reason: Optional[str] = None
    created_at: datetime

    # Enriched, non-column fields
    tenant_name: Optional[str] = None
    tenant_email: Optional[str] = None
    property_name: Optional[str] = None
    unit_number: Optional[str] = None

    class Config:
        from_attributes = True
