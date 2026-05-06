from pydantic import BaseModel
from typing import Optional
from app.models.unit import UnitStatus


class UnitCreate(BaseModel):
    property_id: int
    unit_number: str
    type: str
    floor: Optional[int] = None
    rent_amount: float


class UnitUpdate(BaseModel):
    unit_number: Optional[str] = None
    type: Optional[str] = None
    floor: Optional[int] = None
    rent_amount: Optional[float] = None
    status: Optional[UnitStatus] = None


class UnitOut(BaseModel):
    id: int
    property_id: int
    unit_number: str
    type: str
    floor: Optional[int]
    rent_amount: float
    status: UnitStatus

    class Config:
        from_attributes = True
