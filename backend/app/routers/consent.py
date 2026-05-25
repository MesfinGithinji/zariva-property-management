import random, string
from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user, require_landlord, require_tenant
from app.models.user import User
from app.models.lease import Lease
from app.models.consent import (
    ConsentRecord, PrivacyNoticeVersion, DataSubjectRequest,
    SubletRequest, AlterationRequest, PetConsentRequest, PetDetail,
    GuarantorConsent, RequestStatus,
)
from app.schemas.consent import (
    ConsentCreate, ConsentUpdate, ConsentOut,
    PrivacyNoticeOut,
    DataSubjectRequestCreate, DataSubjectRequestUpdate, DataSubjectRequestOut,
    SubletRequestCreate, SubletRequestOut,
    AlterationRequestCreate, AlterationRequestOut,
    PetConsentCreate, PetConsentOut,
    GuarantorConsentCreate, GuarantorConsentOut,
    ConsentDecision,
)

router = APIRouter(prefix="/consent", tags=["Consent & Data Protection"])

CURRENT_NOTICE_VERSION = "1.0"

PRIVACY_NOTICE = {
    "version": CURRENT_NOTICE_VERSION,
    "effective_date": "2024-01-01T00:00:00",
    "data_controller": "Zariva Africa Properties Ltd",
    "contact": "info@zarivaafrica.com",
    "governed_by": "Kenya Data Protection Act No. 24 of 2019 and Regulations 2021",
    "data_categories": [
        "Identity data: full name, national ID number, passport number, photograph",
        "Contact data: physical address, email address, phone numbers",
        "Financial data: bank account details, M-Pesa number, payment history, credit information",
        "Employment data: employer name, designation, employment reference",
        "Next-of-kin data: name, relationship, contact number of emergency contact",
        "Tenancy data: lease terms, rent payment records, inspection reports, notices, correspondence",
        "Technical data: IP addresses, login details, and interaction data from the online portal",
    ],
    "purposes": [
        {"purpose": "Lease administration and rent collection", "basis": "Contract", "retention": "Duration of tenancy + 7 years"},
        {"purpose": "Legal notices and compliance", "basis": "Legal obligation", "retention": "Duration of tenancy + 7 years"},
        {"purpose": "Credit referencing and background checks", "basis": "Legitimate interest", "retention": "6 months pre-tenancy"},
        {"purpose": "Marketing and service improvement", "basis": "Consent (separate)", "retention": "Until withdrawal of consent"},
        {"purpose": "Dispute resolution and litigation", "basis": "Legal obligation", "retention": "Duration of dispute + 7 years"},
    ],
    "data_sharing": [
        "The Landlord of your rented property, for administering the tenancy",
        "Authorized service contractors and maintenance providers, limited to what is necessary",
        "Credit Reference Bureaus (CRBs) registered in Kenya, in the event of default",
        "Courts, tribunals, or law enforcement agencies, where legally required",
        "Our technology and software service providers, under strict data processing agreements",
    ],
    "your_rights": [
        "Right of Access: request a copy of personal data we hold about you",
        "Right of Rectification: request correction of inaccurate data",
        "Right of Erasure: request deletion where no legitimate basis exists for retention",
        "Right to Object: object to processing for direct marketing",
        "Right to Data Portability: request your data in a portable format",
        "Right to Complain: lodge a complaint with the ODPC of Kenya",
    ],
    "no_sale_of_data": True,
    "security_measures": "Encryption, access controls, audit trails, and regular security reviews",
}


def _ref(prefix: str) -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ZAP-{prefix}-{date.today().strftime('%Y%m%d')}-{suffix}"


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    return forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")


# ─── Privacy Notice ──────────────────────────────────────────────────────────

@router.get("/privacy-notice", response_model=dict)
def get_privacy_notice():
    return PRIVACY_NOTICE


# ─── Form 1 — Tenant Privacy Consent ────────────────────────────────────────

@router.post("", response_model=ConsentOut, status_code=status.HTTP_201_CREATED)
def give_consent(
    payload: ConsentCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not (payload.lease_admin_consent and payload.communications_consent):
        raise HTTPException(status_code=400, detail="Lease administration and communications consent are mandatory")

    existing = db.query(ConsentRecord).filter(ConsentRecord.user_id == current_user.id).first()
    if existing and existing.withdrawn_at is None:
        raise HTTPException(status_code=409, detail="Active consent record already exists")

    if existing:
        # Re-consent after withdrawal
        existing.lease_admin_consent = payload.lease_admin_consent
        existing.communications_consent = payload.communications_consent
        existing.marketing_consent = payload.marketing_consent
        existing.national_id = payload.national_id
        existing.notice_version = CURRENT_NOTICE_VERSION
        existing.consented_at = datetime.utcnow()
        existing.withdrawn_at = None
        existing.ip_address = _get_client_ip(request)
        db.commit()
        db.refresh(existing)
        return existing

    record = ConsentRecord(
        user_id=current_user.id,
        reference_number=_ref("CNS"),
        notice_version=CURRENT_NOTICE_VERSION,
        lease_admin_consent=payload.lease_admin_consent,
        communications_consent=payload.communications_consent,
        marketing_consent=payload.marketing_consent,
        national_id=payload.national_id,
        ip_address=_get_client_ip(request),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/me", response_model=ConsentOut)
def get_my_consent(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(ConsentRecord).filter(ConsentRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="No consent record found")
    return record


@router.patch("/me", response_model=ConsentOut)
def update_consent(
    payload: ConsentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(ConsentRecord).filter(
        ConsentRecord.user_id == current_user.id,
        ConsentRecord.withdrawn_at.is_(None),
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="No active consent record found")
    if payload.marketing_consent is not None:
        record.marketing_consent = payload.marketing_consent
    db.commit()
    db.refresh(record)
    return record


@router.post("/withdraw", response_model=ConsentOut)
def withdraw_consent(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(ConsentRecord).filter(
        ConsentRecord.user_id == current_user.id,
        ConsentRecord.withdrawn_at.is_(None),
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="No active consent record found")
    record.withdrawn_at = datetime.utcnow()
    db.commit()
    db.refresh(record)
    return record


# ─── Data Subject Rights ─────────────────────────────────────────────────────

@router.post("/data-subject-requests", response_model=DataSubjectRequestOut, status_code=status.HTTP_201_CREATED)
def submit_dsr(
    payload: DataSubjectRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = DataSubjectRequest(
        reference_number=_ref("DSR"),
        user_id=current_user.id,
        request_type=payload.request_type,
        description=payload.description,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    out = DataSubjectRequestOut.model_validate(req)
    out.requester_name = current_user.full_name
    return out


@router.get("/data-subject-requests/me", response_model=List[DataSubjectRequestOut])
def my_dsrs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reqs = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.user_id == current_user.id
    ).order_by(DataSubjectRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = DataSubjectRequestOut.model_validate(r)
        out.requester_name = current_user.full_name
        results.append(out)
    return results


@router.get("/data-subject-requests", response_model=List[DataSubjectRequestOut])
def list_dsrs(
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    reqs = db.query(DataSubjectRequest).order_by(DataSubjectRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = DataSubjectRequestOut.model_validate(r)
        out.requester_name = r.user.full_name if r.user else None
        results.append(out)
    return results


@router.patch("/data-subject-requests/{dsr_id}", response_model=DataSubjectRequestOut)
def resolve_dsr(
    dsr_id: int,
    payload: DataSubjectRequestUpdate,
    current_user: User = Depends(require_landlord),
    db: Session = Depends(get_db),
):
    req = db.query(DataSubjectRequest).filter(DataSubjectRequest.id == dsr_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if payload.status:
        req.status = payload.status
    if payload.response:
        req.response = payload.response
    if payload.resolved_at or (payload.status and payload.status != "pending"):
        req.resolved_at = payload.resolved_at or datetime.utcnow()
    db.commit()
    db.refresh(req)
    out = DataSubjectRequestOut.model_validate(req)
    out.requester_name = req.user.full_name if req.user else None
    return out


# ─── Form 2 — Sublet Requests ────────────────────────────────────────────────

@router.post("/sublet", response_model=SubletRequestOut, status_code=status.HTTP_201_CREATED)
def create_sublet(
    payload: SubletRequestCreate,
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    lease = db.query(Lease).filter(Lease.id == payload.lease_id, Lease.tenant_id == current_user.id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    req = SubletRequest(reference_number=_ref("SUB"), tenant_id=current_user.id, **payload.model_dump())
    db.add(req)
    db.commit()
    db.refresh(req)
    out = SubletRequestOut.model_validate(req)
    out.tenant_name = current_user.full_name
    return out


@router.get("/sublet/me", response_model=List[SubletRequestOut])
def my_sublet_requests(current_user: User = Depends(require_tenant), db: Session = Depends(get_db)):
    reqs = db.query(SubletRequest).filter(SubletRequest.tenant_id == current_user.id).order_by(SubletRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = SubletRequestOut.model_validate(r)
        out.tenant_name = current_user.full_name
        results.append(out)
    return results


@router.get("/sublet", response_model=List[SubletRequestOut])
def list_sublet_requests(current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    reqs = db.query(SubletRequest).order_by(SubletRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = SubletRequestOut.model_validate(r)
        out.tenant_name = r.tenant.full_name if r.tenant else None
        results.append(out)
    return results


@router.patch("/sublet/{req_id}", response_model=SubletRequestOut)
def decide_sublet(req_id: int, payload: ConsentDecision, current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    req = db.query(SubletRequest).filter(SubletRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Sublet request not found")
    req.status = payload.status
    req.decision_by = payload.decision_by or current_user.full_name
    req.decision_date = datetime.utcnow()
    req.additional_conditions = payload.additional_conditions
    req.decline_reason = payload.decline_reason
    db.commit()
    db.refresh(req)
    out = SubletRequestOut.model_validate(req)
    out.tenant_name = req.tenant.full_name if req.tenant else None
    return out


# ─── Form 3 — Alteration Requests ────────────────────────────────────────────

@router.post("/alterations", response_model=AlterationRequestOut, status_code=status.HTTP_201_CREATED)
def create_alteration(
    payload: AlterationRequestCreate,
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    lease = db.query(Lease).filter(Lease.id == payload.lease_id, Lease.tenant_id == current_user.id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    req = AlterationRequest(reference_number=_ref("ALT"), tenant_id=current_user.id, **payload.model_dump())
    db.add(req)
    db.commit()
    db.refresh(req)
    out = AlterationRequestOut.model_validate(req)
    out.tenant_name = current_user.full_name
    return out


@router.get("/alterations/me", response_model=List[AlterationRequestOut])
def my_alteration_requests(current_user: User = Depends(require_tenant), db: Session = Depends(get_db)):
    reqs = db.query(AlterationRequest).filter(AlterationRequest.tenant_id == current_user.id).order_by(AlterationRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = AlterationRequestOut.model_validate(r)
        out.tenant_name = current_user.full_name
        results.append(out)
    return results


@router.get("/alterations", response_model=List[AlterationRequestOut])
def list_alteration_requests(current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    reqs = db.query(AlterationRequest).order_by(AlterationRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = AlterationRequestOut.model_validate(r)
        out.tenant_name = r.tenant.full_name if r.tenant else None
        results.append(out)
    return results


@router.patch("/alterations/{req_id}", response_model=AlterationRequestOut)
def decide_alteration(req_id: int, payload: ConsentDecision, current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    req = db.query(AlterationRequest).filter(AlterationRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Alteration request not found")
    req.status = payload.status
    req.decision_by = payload.decision_by or current_user.full_name
    req.decision_date = datetime.utcnow()
    req.modification_conditions = payload.modification_conditions
    req.decline_reason = payload.decline_reason
    db.commit()
    db.refresh(req)
    out = AlterationRequestOut.model_validate(req)
    out.tenant_name = req.tenant.full_name if req.tenant else None
    return out


# ─── Form 4 — Pet Consent Requests ───────────────────────────────────────────

@router.post("/pets", response_model=PetConsentOut, status_code=status.HTTP_201_CREATED)
def create_pet_request(
    payload: PetConsentCreate,
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    lease = db.query(Lease).filter(Lease.id == payload.lease_id, Lease.tenant_id == current_user.id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    req = PetConsentRequest(reference_number=_ref("PET"), tenant_id=current_user.id, lease_id=payload.lease_id)
    db.add(req)
    db.flush()
    for pet in payload.pets:
        db.add(PetDetail(request_id=req.id, **pet.model_dump()))
    db.commit()
    db.refresh(req)
    out = PetConsentOut.model_validate(req)
    out.tenant_name = current_user.full_name
    return out


@router.get("/pets/me", response_model=List[PetConsentOut])
def my_pet_requests(current_user: User = Depends(require_tenant), db: Session = Depends(get_db)):
    reqs = db.query(PetConsentRequest).filter(PetConsentRequest.tenant_id == current_user.id).order_by(PetConsentRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = PetConsentOut.model_validate(r)
        out.tenant_name = current_user.full_name
        results.append(out)
    return results


@router.get("/pets", response_model=List[PetConsentOut])
def list_pet_requests(current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    reqs = db.query(PetConsentRequest).order_by(PetConsentRequest.created_at.desc()).all()
    results = []
    for r in reqs:
        out = PetConsentOut.model_validate(r)
        out.tenant_name = r.tenant.full_name if r.tenant else None
        results.append(out)
    return results


@router.patch("/pets/{req_id}", response_model=PetConsentOut)
def decide_pet(req_id: int, payload: ConsentDecision, current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    req = db.query(PetConsentRequest).filter(PetConsentRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Pet request not found")
    req.status = payload.status
    req.decision_by = payload.decision_by or current_user.full_name
    req.decision_date = datetime.utcnow()
    req.decline_reason = payload.decline_reason
    if payload.additional_deposit is not None:
        req.additional_deposit = payload.additional_deposit
    db.commit()
    db.refresh(req)
    out = PetConsentOut.model_validate(req)
    out.tenant_name = req.tenant.full_name if req.tenant else None
    return out


# ─── Form 5 — Guarantor Consent ──────────────────────────────────────────────

@router.post("/guarantors", response_model=GuarantorConsentOut, status_code=status.HTTP_201_CREATED)
def create_guarantor(
    payload: GuarantorConsentCreate,
    current_user: User = Depends(require_tenant),
    db: Session = Depends(get_db),
):
    if not payload.data_processing_consent:
        raise HTTPException(status_code=400, detail="Guarantor must consent to data processing")
    lease = db.query(Lease).filter(Lease.id == payload.lease_id, Lease.tenant_id == current_user.id).first()
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    guarantor = GuarantorConsent(
        reference_number=_ref("GTR"),
        tenant_id=current_user.id,
        signed_at=datetime.utcnow(),
        **payload.model_dump(),
    )
    db.add(guarantor)
    db.commit()
    db.refresh(guarantor)
    return guarantor


@router.get("/guarantors/me", response_model=List[GuarantorConsentOut])
def my_guarantors(current_user: User = Depends(require_tenant), db: Session = Depends(get_db)):
    return db.query(GuarantorConsent).filter(GuarantorConsent.tenant_id == current_user.id).all()


@router.get("/guarantors", response_model=List[GuarantorConsentOut])
def list_guarantors(current_user: User = Depends(require_landlord), db: Session = Depends(get_db)):
    return db.query(GuarantorConsent).order_by(GuarantorConsent.created_at.desc()).all()
