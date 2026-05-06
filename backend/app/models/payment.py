from sqlalchemy import Column, Integer, Float, String, Enum, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class PaymentMethod(str, enum.Enum):
    mpesa = "M-Pesa"
    bank_transfer = "Bank Transfer"
    cash = "Cash"


class PaymentStatus(str, enum.Enum):
    completed = "completed"
    pending = "pending"
    failed = "failed"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    lease_id = Column(Integer, ForeignKey("leases.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(Date, nullable=False)
    month_for = Column(String, nullable=False)   # "February 2026"
    method = Column(Enum(PaymentMethod), nullable=False, default=PaymentMethod.mpesa)
    reference = Column(String, nullable=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.completed)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    lease = relationship("Lease", back_populates="payments")
    tenant = relationship("User", back_populates="payments")
