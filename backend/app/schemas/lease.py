from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.lease import LeaseStatus


class LeaseCreate(BaseModel):
    unit_id: int
    tenant_id: int
    monthly_rent: float
    deposit: float
    start_date: date
    end_date: date


class LeaseUpdate(BaseModel):
    monthly_rent: Optional[float] = None
    end_date: Optional[date] = None
    status: Optional[LeaseStatus] = None


class LeaseOut(BaseModel):
    id: int
    unit_id: int
    tenant_id: int
    monthly_rent: float
    deposit: float
    start_date: date
    end_date: date
    status: LeaseStatus
    created_at: datetime
    tenant_name: Optional[str] = None
    unit_number: Optional[str] = None
    property_name: Optional[str] = None

    class Config:
        from_attributes = True
