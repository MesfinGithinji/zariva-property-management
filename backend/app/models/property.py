from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class PropertyType(str, enum.Enum):
    apartment = "Apartment"
    commercial = "Commercial"
    villa = "Villa"
    mixed_use = "Mixed Use"


class PropertyStatus(str, enum.Enum):
    active = "active"
    maintenance = "maintenance"
    inactive = "inactive"


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False)
    address = Column(String, nullable=False)
    type = Column(Enum(PropertyType), nullable=False)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.active)
    year_built = Column(Integer, nullable=True)
    property_value = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="properties")
    units = relationship("Unit", back_populates="property", cascade="all, delete-orphan")
