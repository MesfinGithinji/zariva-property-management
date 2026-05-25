from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.consent import RequestStatus, DataSubjectRequestType, SubletPurpose


# ─── Form 1 — Privacy Consent ────────────────────────────────────────────────

class ConsentCreate(BaseModel):
    lease_admin_consent: bool
    communications_consent: bool
    marketing_consent: bool = False
    national_id: Optional[str] = None


class ConsentUpdate(BaseModel):
    marketing_consent: Optional[bool] = None


class ConsentOut(BaseModel):
    id: int
    reference_number: str
    notice_version: str
    lease_admin_consent: bool
    communications_consent: bool
    marketing_consent: bool
    national_id: Optional[str]
    consented_at: datetime
    withdrawn_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── Privacy Notice ──────────────────────────────────────────────────────────

class PrivacyNoticeOut(BaseModel):
    version: str
    effective_date: datetime
    summary_of_changes: Optional[str]
    is_current: bool

    class Config:
        from_attributes = True


# ─── Data Subject Rights ─────────────────────────────────────────────────────

class DataSubjectRequestCreate(BaseModel):
    request_type: DataSubjectRequestType
    description: Optional[str] = None


class DataSubjectRequestUpdate(BaseModel):
    status: Optional[str] = None
    response: Optional[str] = None
    resolved_at: Optional[datetime] = None


class DataSubjectRequestOut(BaseModel):
    id: int
    reference_number: str
    request_type: DataSubjectRequestType
    description: Optional[str]
    status: str
    created_at: datetime
    resolved_at: Optional[datetime]
    response: Optional[str]
    requester_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Form 2 — Sublet ─────────────────────────────────────────────────────────

class SubletRequestCreate(BaseModel):
    lease_id: int
    subtenant_name: str
    subtenant_id_no: str
    proposed_commencement: datetime
    proposed_duration: str
    monthly_rent_to_subtenant: float
    purpose: SubletPurpose
    reason: str


class ConsentDecision(BaseModel):
    status: RequestStatus
    decision_by: Optional[str] = None
    additional_conditions: Optional[str] = None
    modification_conditions: Optional[str] = None
    decline_reason: Optional[str] = None
    additional_deposit: Optional[float] = None


class SubletRequestOut(BaseModel):
    id: int
    reference_number: str
    tenant_id: int
    lease_id: int
    subtenant_name: str
    subtenant_id_no: str
    proposed_commencement: datetime
    proposed_duration: str
    monthly_rent_to_subtenant: float
    purpose: SubletPurpose
    reason: str
    status: RequestStatus
    decision_by: Optional[str]
    decision_date: Optional[datetime]
    additional_conditions: Optional[str]
    decline_reason: Optional[str]
    created_at: datetime
    tenant_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Form 3 — Alterations ────────────────────────────────────────────────────

class AlterationRequestCreate(BaseModel):
    lease_id: int
    description_of_works: str
    contractor_name: Optional[str] = None
    contractor_contact: Optional[str] = None
    estimated_start_date: Optional[datetime] = None
    estimated_duration: Optional[str] = None
    estimated_cost: Optional[float] = None


class AlterationRequestOut(BaseModel):
    id: int
    reference_number: str
    tenant_id: int
    lease_id: int
    description_of_works: str
    contractor_name: Optional[str]
    contractor_contact: Optional[str]
    estimated_start_date: Optional[datetime]
    estimated_duration: Optional[str]
    estimated_cost: Optional[float]
    status: RequestStatus
    decision_by: Optional[str]
    decision_date: Optional[datetime]
    modification_conditions: Optional[str]
    decline_reason: Optional[str]
    created_at: datetime
    tenant_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Form 4 — Pets ───────────────────────────────────────────────────────────

class PetDetailCreate(BaseModel):
    animal_type: str
    breed: Optional[str] = None
    number: int = 1
    vaccinated: bool = False


class PetDetailOut(BaseModel):
    id: int
    animal_type: str
    breed: Optional[str]
    number: int
    vaccinated: bool

    class Config:
        from_attributes = True


class PetConsentCreate(BaseModel):
    lease_id: int
    pets: List[PetDetailCreate]


class PetConsentOut(BaseModel):
    id: int
    reference_number: str
    tenant_id: int
    lease_id: int
    pets: List[PetDetailOut]
    additional_deposit: Optional[float]
    status: RequestStatus
    decision_by: Optional[str]
    decision_date: Optional[datetime]
    decline_reason: Optional[str]
    created_at: datetime
    tenant_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Form 5 — Guarantor ──────────────────────────────────────────────────────

class GuarantorConsentCreate(BaseModel):
    lease_id: int
    full_name: str
    national_id: str
    relationship_to_tenant: str
    employer_occupation: Optional[str] = None
    phone: str
    email: Optional[str] = None
    physical_address: Optional[str] = None
    data_processing_consent: bool
    witness_name: Optional[str] = None
    witness_id: Optional[str] = None


class GuarantorConsentOut(BaseModel):
    id: int
    reference_number: str
    lease_id: int
    tenant_id: int
    full_name: str
    national_id: str
    relationship_to_tenant: str
    employer_occupation: Optional[str]
    phone: str
    email: Optional[str]
    physical_address: Optional[str]
    data_processing_consent: bool
    signed_at: Optional[datetime]
    witness_name: Optional[str]
    witness_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
