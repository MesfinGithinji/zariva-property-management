from sqlalchemy import Column, Integer, Float, Enum, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class LeaseStatus(str, enum.Enum):
    active = "active"
    ending = "ending"    # within 90 days of end
    expired = "expired"
    terminated = "terminated"


class Lease(Base):
    __tablename__ = "leases"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    monthly_rent = Column(Float, nullable=False)
    deposit = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum(LeaseStatus), default=LeaseStatus.active)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    unit = relationship("Unit", back_populates="leases")
    tenant = relationship("User", back_populates="leases", foreign_keys=[tenant_id])
    payments = relationship("Payment", back_populates="lease")
