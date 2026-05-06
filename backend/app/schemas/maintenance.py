from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.maintenance import MaintenancePriority, MaintenanceStatus


class MaintenanceCreate(BaseModel):
    unit_id: int
    issue: str
    description: Optional[str] = None
    category: str = "General"
    priority: MaintenancePriority = MaintenancePriority.medium


class MaintenanceUpdate(BaseModel):
    status: Optional[MaintenanceStatus] = None
    assigned_to: Optional[str] = None
    estimated_completion: Optional[date] = None
    completed_date: Optional[date] = None
    cost: Optional[float] = None
    priority: Optional[MaintenancePriority] = None


class MaintenanceOut(BaseModel):
    id: int
    unit_id: int
    tenant_id: int
    issue: str
    description: Optional[str]
    category: str
    priority: MaintenancePriority
    status: MaintenanceStatus
    assigned_to: Optional[str]
    estimated_completion: Optional[date]
    completed_date: Optional[date]
    cost: Optional[float]
    submitted_date: datetime
    tenant_name: Optional[str] = None
    unit_number: Optional[str] = None
    property_name: Optional[str] = None

    class Config:
        from_attributes = True
