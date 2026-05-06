from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class UnitStatus(str, enum.Enum):
    occupied = "occupied"
    vacant = "vacant"
    maintenance = "maintenance"


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    unit_number = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "2BR", "3BR", "Studio", "Office", etc.
    floor = Column(Integer, nullable=True)
    rent_amount = Column(Float, nullable=False)
    status = Column(Enum(UnitStatus), default=UnitStatus.vacant)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    property = relationship("Property", back_populates="units")
    leases = relationship("Lease", back_populates="unit")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="unit")
