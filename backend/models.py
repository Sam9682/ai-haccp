from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, DECIMAL, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    organization = relationship("Organization")

class UsageLog(Base):
    __tablename__ = "usage_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    action_type = Column(String(100), nullable=False)
    resource_used = Column(DECIMAL(10,6), nullable=False)
    meta_data = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    name = Column(String(255), nullable=False)
    category = Column(String(100))
    allergens = Column(JSON)
    shelf_life_days = Column(Integer)
    storage_temp_min = Column(DECIMAL(5,2))
    storage_temp_max = Column(DECIMAL(5,2))
    created_at = Column(DateTime, server_default=func.now())

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    name = Column(String(255), nullable=False)
    contact_info = Column(JSON)
    certification_status = Column(String(50))
    risk_level = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())

class TemperatureLog(Base):
    __tablename__ = "temperature_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    location = Column(String(255), nullable=False)
    temperature = Column(DECIMAL(5,2), nullable=False)
    recorded_by = Column(Integer, ForeignKey("users.id"))
    equipment_id = Column(String(100))
    is_within_limits = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())

class CleaningRecord(Base):
    __tablename__ = "cleaning_records"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    area = Column(String(255), nullable=False)
    cleaning_type = Column(String(100))
    products_used = Column(JSON)
    performed_by = Column(Integer, ForeignKey("users.id"))
    verified_by = Column(Integer, ForeignKey("users.id"))
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class BatchTracking(Base):
    __tablename__ = "batch_tracking"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    batch_number = Column(String(255), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    production_date = Column(Date)
    expiry_date = Column(Date)
    location = Column(String(255))
    status = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    severity = Column(String(50))
    category = Column(String(100))
    reported_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="open")
    root_cause = Column(Text)
    corrective_actions = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    resolved_at = Column(DateTime)

class CleaningPlan(Base):
    __tablename__ = "cleaning_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    rooms = Column(JSON)
    cleaning_frequency = Column(String(50), nullable=False)
    estimated_duration = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class RoomCleaning(Base):
    __tablename__ = "room_cleanings"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    cleaning_plan_id = Column(Integer, ForeignKey("cleaning_plans.id"))
    room_name = Column(String(255), nullable=False)
    cleaned_by = Column(Integer, ForeignKey("users.id"))
    notes = Column(Text)
    cleaned_at = Column(DateTime, server_default=func.now())
    
    cleaning_plan = relationship("CleaningPlan")
    user = relationship("User")

class Configuration(Base):
    __tablename__ = "configuration"
    
    id = Column(Integer, primary_key=True, index=True)
    parameter = Column(String(255), nullable=False, unique=True)
    value = Column(String(1000), nullable=False)
    parent_parameter = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class MaterialReception(Base):
    __tablename__ = "material_receptions"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    barcode = Column(String(255))
    quantity = Column(DECIMAL(10,2), nullable=False)
    unit = Column(String(50), nullable=False)
    expiry_date = Column(Date)
    batch_number = Column(String(255))
    temperature_on_arrival = Column(DECIMAL(5,2))
    quality_notes = Column(Text)
    image_path = Column(String(500))
    ai_analysis = Column(JSON)
    received_by = Column(Integer, ForeignKey("users.id"))
    received_at = Column(DateTime, server_default=func.now())
    
    supplier = relationship("Supplier")
    user = relationship("User")