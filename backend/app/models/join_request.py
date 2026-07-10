from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Text, Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.consent import RequestStatus


class JoinRequest(Base):
    """A self-signed-up tenant's request to be linked to a landlord's property.

    The landlord reviews the request, assigns a vacant unit + lease terms, and on
    approval a Lease is created (see routers/join_requests.py). Mirrors the consent
    request pattern (reference_number, RequestStatus, decision_by/decision_date).
    """

    __tablename__ = "join_requests"

    id = Column(Integer, primary_key=True, index=True)
    reference_number = Column(String(50), unique=True, nullable=False)

    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=True)

    status = Column(SAEnum(RequestStatus), default=RequestStatus.pending, nullable=False)

    # Populated by the landlord at decision time
    unit_id = Column(Integer, ForeignKey("units.id", ondelete="SET NULL"), nullable=True)
    lease_id = Column(Integer, ForeignKey("leases.id", ondelete="SET NULL"), nullable=True)
    decision_by = Column(String(150), nullable=True)
    decision_date = Column(DateTime, nullable=True)
    decline_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("User", backref="join_requests")
    property = relationship("Property", backref="join_requests")
