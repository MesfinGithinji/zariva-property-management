import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    ForeignKey, Text, Numeric, Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class RequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    approved_with_modifications = "approved_with_modifications"
    declined = "declined"


class DataSubjectRequestType(str, enum.Enum):
    access = "access"
    rectification = "rectification"
    erasure = "erasure"
    portability = "portability"
    objection = "objection"


class SubletPurpose(str, enum.Enum):
    full_sublet = "full_sublet"
    room_only = "room_only"
    full_assignment = "full_assignment"


# ─── Form 1 ─────────────────────────────────────────────────────────────────

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    reference_number = Column(String(50), unique=True, nullable=False)
    notice_version = Column(String(10), nullable=False, default="1.0")

    # Three checkboxes from the document
    lease_admin_consent = Column(Boolean, nullable=False)       # mandatory
    communications_consent = Column(Boolean, nullable=False)    # mandatory
    marketing_consent = Column(Boolean, nullable=False, default=False)  # optional

    national_id = Column(String(30), nullable=True)
    ip_address = Column(String(45), nullable=True)
    consented_at = Column(DateTime, default=datetime.utcnow)
    withdrawn_at = Column(DateTime, nullable=True)

    user = relationship("User", backref="consent_record", uselist=False)


class PrivacyNoticeVersion(Base):
    __tablename__ = "privacy_notice_versions"

    id = Column(Integer, primary_key=True)
    version = Column(String(10), nullable=False, unique=True)
    effective_date = Column(DateTime, nullable=False)
    summary_of_changes = Column(Text, nullable=True)
    is_current = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── Data Subject Rights ─────────────────────────────────────────────────────

class DataSubjectRequest(Base):
    __tablename__ = "data_subject_requests"

    id = Column(Integer, primary_key=True)
    reference_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    request_type = Column(SAEnum(DataSubjectRequestType), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    response = Column(Text, nullable=True)

    user = relationship("User", backref="data_subject_requests")


# ─── Form 2 — Sublet / Assign ────────────────────────────────────────────────

class SubletRequest(Base):
    __tablename__ = "sublet_requests"

    id = Column(Integer, primary_key=True)
    reference_number = Column(String(50), unique=True, nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id", ondelete="CASCADE"), nullable=False)

    subtenant_name = Column(String(150), nullable=False)
    subtenant_id_no = Column(String(30), nullable=False)
    proposed_commencement = Column(DateTime, nullable=False)
    proposed_duration = Column(String(100), nullable=False)
    monthly_rent_to_subtenant = Column(Numeric(12, 2), nullable=False)
    purpose = Column(SAEnum(SubletPurpose), nullable=False)
    reason = Column(Text, nullable=False)

    status = Column(SAEnum(RequestStatus), default=RequestStatus.pending, nullable=False)
    decision_by = Column(String(150), nullable=True)
    decision_date = Column(DateTime, nullable=True)
    additional_conditions = Column(Text, nullable=True)
    decline_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("User", backref="sublet_requests")
    lease = relationship("Lease", backref="sublet_requests")


# ─── Form 3 — Alterations ────────────────────────────────────────────────────

class AlterationRequest(Base):
    __tablename__ = "alteration_requests"

    id = Column(Integer, primary_key=True)
    reference_number = Column(String(50), unique=True, nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id", ondelete="CASCADE"), nullable=False)

    description_of_works = Column(Text, nullable=False)
    contractor_name = Column(String(150), nullable=True)
    contractor_contact = Column(String(100), nullable=True)
    estimated_start_date = Column(DateTime, nullable=True)
    estimated_duration = Column(String(100), nullable=True)
    estimated_cost = Column(Numeric(12, 2), nullable=True)

    status = Column(SAEnum(RequestStatus), default=RequestStatus.pending, nullable=False)
    decision_by = Column(String(150), nullable=True)
    decision_date = Column(DateTime, nullable=True)
    modification_conditions = Column(Text, nullable=True)
    decline_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("User", backref="alteration_requests")
    lease = relationship("Lease", backref="alteration_requests")


# ─── Form 4 — Pets ───────────────────────────────────────────────────────────

class PetConsentRequest(Base):
    __tablename__ = "pet_consent_requests"

    id = Column(Integer, primary_key=True)
    reference_number = Column(String(50), unique=True, nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id", ondelete="CASCADE"), nullable=False)

    additional_deposit = Column(Numeric(12, 2), nullable=True)
    status = Column(SAEnum(RequestStatus), default=RequestStatus.pending, nullable=False)
    decision_by = Column(String(150), nullable=True)
    decision_date = Column(DateTime, nullable=True)
    decline_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("User", backref="pet_requests")
    lease = relationship("Lease", backref="pet_requests")
    pets = relationship("PetDetail", back_populates="request", cascade="all, delete-orphan")


class PetDetail(Base):
    __tablename__ = "pet_details"

    id = Column(Integer, primary_key=True)
    request_id = Column(Integer, ForeignKey("pet_consent_requests.id", ondelete="CASCADE"), nullable=False)
    animal_type = Column(String(50), nullable=False)
    breed = Column(String(100), nullable=True)
    number = Column(Integer, default=1, nullable=False)
    vaccinated = Column(Boolean, default=False, nullable=False)

    request = relationship("PetConsentRequest", back_populates="pets")


# ─── Form 5 — Guarantor ──────────────────────────────────────────────────────

class GuarantorConsent(Base):
    __tablename__ = "guarantor_consents"

    id = Column(Integer, primary_key=True)
    reference_number = Column(String(50), unique=True, nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id", ondelete="CASCADE"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    full_name = Column(String(150), nullable=False)
    national_id = Column(String(30), nullable=False)
    relationship_to_tenant = Column(String(100), nullable=False)
    employer_occupation = Column(String(150), nullable=True)
    phone = Column(String(20), nullable=False)
    email = Column(String(150), nullable=True)
    physical_address = Column(Text, nullable=True)

    data_processing_consent = Column(Boolean, nullable=False, default=False)
    signed_at = Column(DateTime, nullable=True)
    witness_name = Column(String(150), nullable=True)
    witness_id = Column(String(30), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lease = relationship("Lease", backref="guarantors")
    tenant = relationship("User", backref="guarantor_consents")
