from sqlalchemy import Column, Integer, Float, String, Enum, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class MaintenancePriority(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"


class MaintenanceStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    issue = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False, default="General")
    priority = Column(Enum(MaintenancePriority), default=MaintenancePriority.medium)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.pending)
    assigned_to = Column(String, nullable=True)
    estimated_completion = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    cost = Column(Float, nullable=True)
    submitted_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    unit = relationship("Unit", back_populates="maintenance_requests")
    tenant = relationship("User", back_populates="maintenance_requests")
