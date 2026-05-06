"""
Seed the database with realistic Kenyan property data.
Run: python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, timedelta
from app.core.database import SessionLocal, engine
from app.core.database import Base
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.property import Property, PropertyType, PropertyStatus
from app.models.unit import Unit, UnitStatus
from app.models.lease import Lease, LeaseStatus
from app.models.payment import Payment, PaymentMethod, PaymentStatus
from app.models.maintenance import MaintenanceRequest, MaintenancePriority, MaintenanceStatus

# Create all tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def run():
    # Clear existing data
    db.query(MaintenanceRequest).delete()
    db.query(Payment).delete()
    db.query(Lease).delete()
    db.query(Unit).delete()
    db.query(Property).delete()
    db.query(User).delete()
    db.commit()

    # ── Users ───────────────────────────────────────────────────────────
    landlord = User(
        email="matty@zariva.com",
        hashed_password=hash_password("zariva123"),
        full_name="Matty Otieno",
        phone="+254722123456",
        role=UserRole.landlord,
    )
    db.add(landlord)

    tenant_data = [
        ("john.kamau@email.com",    "John Kamau",       "+254712000001"),
        ("mary.wanjiru@email.com",  "Mary Wanjiru",     "+254722000002"),
        ("david.ochieng@email.com", "David Ochieng",    "+254733000003"),
        ("sarah.akinyi@email.com",  "Sarah Akinyi",     "+254712345678"),
        ("peter.mwangi@email.com",  "Peter Mwangi",     "+254700000005"),
        ("grace.njeri@email.com",   "Grace Njeri",      "+254711000006"),
        ("james.oloo@email.com",    "James Oloo",       "+254723000007"),
        ("ann.muthoni@email.com",   "Ann Muthoni",      "+254714000008"),
        ("thomas.kipchoge@email.com","Thomas Kipchoge", "+254701000009"),
        ("lydia.chebet@email.com",  "Lydia Chebet",     "+254716000010"),
    ]
    tenants = []
    for email, name, phone in tenant_data:
        t = User(
            email=email,
            hashed_password=hash_password("tenant123"),
            full_name=name,
            phone=phone,
            role=UserRole.tenant,
        )
        db.add(t)
        tenants.append(t)

    db.commit()
    db.refresh(landlord)
    for t in tenants:
        db.refresh(t)

    # ── Properties ──────────────────────────────────────────────────────
    props_data = [
        ("Kilimani Apartments",  "Kilimani, Nairobi",  "Argwings Kodhek Road, Kilimani",   PropertyType.apartment,   2018, 85_000_000,  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"),
        ("Westlands Towers",     "Westlands, Nairobi", "Waiyaki Way, Westlands",            PropertyType.commercial,  2015, 120_000_000, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"),
        ("Karen Villas",         "Karen, Nairobi",     "Karen Road, Karen",                 PropertyType.villa,       2020, 95_000_000,  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"),
        ("Lavington Heights",    "Lavington, Nairobi", "Gitanga Road, Lavington",           PropertyType.apartment,   2019, 75_000_000,  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400"),
        ("Parklands Plaza",      "Parklands, Nairobi", "3rd Parklands Avenue, Parklands",  PropertyType.mixed_use,   2016, 60_000_000,  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"),
    ]

    properties = []
    for name, loc, addr, ptype, yr, val, img in props_data:
        p = Property(
            owner_id=landlord.id,
            name=name, location=loc, address=addr,
            type=ptype, year_built=yr, property_value=val,
            image_url=img, status=PropertyStatus.active,
        )
        db.add(p)
        properties.append(p)

    db.commit()
    for p in properties:
        db.refresh(p)

    kilimani, westlands, karen, lavington, parklands = properties

    # ── Units ───────────────────────────────────────────────────────────
    units = []
    unit_defs = [
        # (property, number, type, floor, rent)
        (kilimani,  "A01", "2BR", 1, 45000), (kilimani,  "A02", "2BR", 1, 45000),
        (kilimani,  "A03", "3BR", 1, 55000), (kilimani,  "A04", "2BR", 2, 45000),
        (kilimani,  "A05", "2BR", 2, 45000), (kilimani,  "A06", "3BR", 2, 55000),
        (kilimani,  "A07", "2BR", 3, 45000), (kilimani,  "A08", "2BR", 3, 45000),
        (kilimani,  "A09", "3BR", 3, 55000), (kilimani,  "A10", "2BR", 4, 45000),
        (kilimani,  "A11", "2BR", 4, 45000), (kilimani,  "A12", "3BR", 4, 55000),
        (westlands, "B01", "Office", 1, 90000), (westlands, "B02", "Office", 1, 90000),
        (westlands, "B03", "Office", 2, 95000), (westlands, "B04", "Office", 2, 95000),
        (westlands, "B05", "3BR",    3, 90000), (westlands, "B06", "3BR",    3, 90000),
        (westlands, "B12", "3BR",    4, 110000),
        (karen,     "V01", "4BR Villa", 1, 75000), (karen, "V02", "3BR Villa", 1, 65000),
        (karen,     "V03", "4BR Villa", 1, 75000), (karen, "V04", "3BR Villa", 1, 65000),
        (karen,     "V05", "4BR Villa", 1, 75000), (karen, "V06", "3BR Villa", 1, 65000),
        (lavington, "C01", "3BR", 1, 85000), (lavington, "C02", "2BR", 1, 68000),
        (lavington, "C03", "3BR", 2, 85000), (lavington, "C04", "2BR", 2, 68000),
        (lavington, "C05", "3BR", 3, 85000), (lavington, "C06", "2BR", 3, 68000),
        (lavington, "C07", "3BR", 4, 85000), (lavington, "C08", "2BR", 4, 68000),
        (lavington, "C09", "3BR", 5, 85000), (lavington, "C10", "2BR", 5, 68000),
        (parklands, "D01", "Retail",  1, 40000), (parklands, "D02", "Office",  1, 30000),
        (parklands, "D03", "Office",  2, 30000), (parklands, "D04", "2BR",     2, 45000),
        (parklands, "D05", "Retail",  1, 40000), (parklands, "D06", "Office",  3, 35000),
        (parklands, "D07", "2BR",     3, 45000), (parklands, "D08", "Office",  4, 30000),
    ]
    for prop, num, utype, floor, rent in unit_defs:
        u = Unit(property_id=prop.id, unit_number=num, type=utype, floor=floor, rent_amount=rent)
        db.add(u)
        units.append(u)

    db.commit()
    for u in units:
        db.refresh(u)

    # Helper: find unit by number
    def find_unit(num):
        return next(u for u in units if u.unit_number == num)

    # ── Leases ──────────────────────────────────────────────────────────
    today = date.today()
    leases_data = [
        # (unit_num, tenant_idx, start, end, rent)
        ("A12", 0,  date(2025, 1, 1),  date(2026, 12, 31), 55000),
        ("B05", 1,  date(2024, 7, 1),  date(2026, 6, 30),  90000),
        ("V03", 2,  date(2024, 3, 1),  date(2026, 2, 28),  75000),
        ("C08", 3,  date(2025, 1, 1),  date(2026, 12, 31), 68000),
        ("D02", 4,  date(2025, 4, 1),  date(2026, 3, 31),  30000),
        ("A07", 5,  date(2024, 9, 1),  date(2026, 8, 31),  45000),
        ("V02", 6,  date(2025, 6, 1),  date(2027, 5, 31),  65000),
        ("D05", 7,  date(2024, 12, 1), date(2025, 11, 30), 40000),
        ("C03", 8,  date(2025, 3, 1),  date(2026, 2, 28),  85000),
        ("B12", 9,  date(2024, 1, 1),  date(2026, 12, 31), 110000),
    ]
    created_leases = []
    for unit_num, tidx, start, end, rent in leases_data:
        unit = find_unit(unit_num)
        days_left = (end - today).days
        if days_left <= 0:
            lst = LeaseStatus.expired
        elif days_left <= 90:
            lst = LeaseStatus.ending
        else:
            lst = LeaseStatus.active

        lease = Lease(
            unit_id=unit.id,
            tenant_id=tenants[tidx].id,
            monthly_rent=rent,
            deposit=rent * 2,
            start_date=start,
            end_date=end,
            status=lst,
        )
        db.add(lease)
        unit.status = UnitStatus.occupied
        created_leases.append((lease, unit_num, tidx))

    db.commit()
    for lease, _, _ in created_leases:
        db.refresh(lease)

    # ── Payments ────────────────────────────────────────────────────────
    months = [
        ("February 2026", date(2026, 2, 3)),
        ("January 2026",  date(2026, 1, 5)),
        ("December 2025", date(2025, 12, 2)),
        ("November 2025", date(2025, 11, 4)),
        ("October 2025",  date(2025, 10, 1)),
    ]
    # Most tenants paid consistently; tenant idx 3 (Sarah) is overdue (skip March)
    for lease, unit_num, tidx in created_leases:
        if tidx == 3:  # Sarah — overdue, only pay through Feb
            pay_months = months
        else:
            pay_months = months

        for month_str, pay_date in pay_months:
            import random, string
            ref = "QZR" + "".join(random.choices(string.ascii_uppercase + string.digits, k=7))
            method = PaymentMethod.mpesa if tidx % 3 != 2 else PaymentMethod.bank_transfer
            p = Payment(
                lease_id=lease.id,
                tenant_id=tenants[tidx].id,
                amount=lease.monthly_rent,
                payment_date=pay_date,
                month_for=month_str,
                method=method,
                reference=ref,
                status=PaymentStatus.completed,
            )
            db.add(p)

    db.commit()

    # ── Maintenance Requests ─────────────────────────────────────────────
    maint_data = [
        # (unit_num, tenant_idx, issue, category, priority, status, assigned)
        ("B05", 1, "Plumbing issue in kitchen",    "Plumbing",  MaintenancePriority.high,   MaintenanceStatus.pending,     None),
        ("A07", 5, "Air conditioning not working", "HVAC",      MaintenancePriority.medium, MaintenanceStatus.in_progress, "Tech Solutions Ltd"),
        ("V02", 6, "Broken window in bedroom",     "Security",  MaintenancePriority.high,   MaintenanceStatus.pending,     None),
        ("D05", 7, "Electrical outlet not working","Electrical",MaintenancePriority.low,    MaintenanceStatus.pending,     None),
        ("C03", 8, "Water heater malfunction",     "Plumbing",  MaintenancePriority.high,   MaintenanceStatus.in_progress, "AquaFix Kenya"),
        ("A12", 0, "Leaking kitchen faucet",       "Plumbing",  MaintenancePriority.medium, MaintenanceStatus.completed,   "ProPlumb Ltd"),
        ("C08", 3, "Broken bedroom window lock",   "Security",  MaintenancePriority.high,   MaintenanceStatus.completed,   "SecureFix Kenya"),
    ]
    for unit_num, tidx, issue, cat, priority, mstatus, assigned in maint_data:
        unit = find_unit(unit_num)
        req = MaintenanceRequest(
            unit_id=unit.id,
            tenant_id=tenants[tidx].id,
            issue=issue,
            category=cat,
            priority=priority,
            status=mstatus,
            assigned_to=assigned,
            completed_date=date(2026, 3, 10) if mstatus == MaintenanceStatus.completed else None,
        )
        db.add(req)

    db.commit()
    db.close()

    print("✅ Database seeded successfully!")
    print(f"   1 landlord  → matty@zariva.com / zariva123")
    print(f"   10 tenants  → [name]@email.com  / tenant123")
    print(f"   5 properties, 43 units, 10 leases, 50 payments, 7 maintenance requests")


if __name__ == "__main__":
    run()
