from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.property import PropertyType, PropertyStatus


class PropertyCreate(BaseModel):
    name: str
    location: str
    address: str
    type: PropertyType
    year_built: Optional[int] = None
    property_value: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    type: Optional[PropertyType] = None
    status: Optional[PropertyStatus] = None
    year_built: Optional[int] = None
    property_value: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class PropertyOut(BaseModel):
    id: int
    owner_id: int
    name: str
    location: str
    address: str
    type: PropertyType
    status: PropertyStatus
    year_built: Optional[int]
    property_value: Optional[float]
    description: Optional[str]
    image_url: Optional[str]
    created_at: datetime
    total_units: int = 0
    occupied_units: int = 0
    occupancy_rate: float = 0.0
    monthly_income: float = 0.0

    class Config:
        from_attributes = True
