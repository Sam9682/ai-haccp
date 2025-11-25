from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

class OrganizationCreate(BaseModel):
    name: str
    type: str

class OrganizationResponse(BaseModel):
    id: int
    name: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str
    organization_id: int

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    organization_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    allergens: Optional[List[str]] = None
    shelf_life_days: Optional[int] = None
    storage_temp_min: Optional[Decimal] = None
    storage_temp_max: Optional[Decimal] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    category: Optional[str]
    allergens: Optional[List[str]]
    shelf_life_days: Optional[int]
    storage_temp_min: Optional[Decimal]
    storage_temp_max: Optional[Decimal]
    created_at: datetime

    class Config:
        from_attributes = True

class TemperatureLogCreate(BaseModel):
    location: str
    temperature: Decimal
    equipment_id: Optional[str] = None
    is_within_limits: Optional[bool] = None

class TemperatureLogResponse(BaseModel):
    id: int
    location: str
    temperature: Decimal
    equipment_id: Optional[str]
    is_within_limits: Optional[bool]
    created_at: datetime

    class Config:
        from_attributes = True

class SupplierCreate(BaseModel):
    name: str
    contact_info: Optional[dict] = None
    certification_status: Optional[str] = None
    risk_level: Optional[int] = 1

class SupplierResponse(BaseModel):
    id: int
    name: str
    contact_info: Optional[dict]
    certification_status: Optional[str]
    risk_level: int
    created_at: datetime

    class Config:
        from_attributes = True

class BatchTrackingCreate(BaseModel):
    batch_number: str
    product_id: int
    supplier_id: Optional[int] = None
    production_date: Optional[date] = None
    expiry_date: Optional[date] = None
    location: Optional[str] = None
    status: Optional[str] = "received"

class BatchTrackingResponse(BaseModel):
    id: int
    batch_number: str
    product_id: int
    supplier_id: Optional[int]
    production_date: Optional[date]
    expiry_date: Optional[date]
    location: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CleaningRecordCreate(BaseModel):
    area: str
    cleaning_type: Optional[str] = None
    products_used: Optional[List[str]] = None
    notes: Optional[str] = None

class CleaningRecordResponse(BaseModel):
    id: int
    area: str
    cleaning_type: Optional[str]
    products_used: Optional[List[str]]
    performed_by: int
    verified_by: Optional[int]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str
    category: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    severity: str
    category: Optional[str]
    reported_by: int
    status: str
    root_cause: Optional[str]
    corrective_actions: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True

class CleaningPlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    rooms: List[dict]  # [{"name": "Kitchen", "x": 100, "y": 150, "width": 200, "height": 100}]
    cleaning_frequency: str  # daily, weekly, monthly
    estimated_duration: Optional[int] = None  # minutes

class CleaningPlanResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    rooms: List[dict]
    cleaning_frequency: str
    estimated_duration: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class RoomCleaningCreate(BaseModel):
    room_name: str
    cleaning_plan_id: int
    notes: Optional[str] = None

class RoomCleaningResponse(BaseModel):
    id: int
    room_name: str
    cleaning_plan_id: int
    cleaned_by: int
    notes: Optional[str]
    cleaned_at: datetime

    class Config:
        from_attributes = True

class MaterialReceptionCreate(BaseModel):
    supplier_id: int
    product_name: str
    category: str
    barcode: Optional[str] = None
    quantity: float
    unit: str  # kg, pieces, boxes, etc.
    expiry_date: Optional[date] = None
    batch_number: Optional[str] = None
    temperature_on_arrival: Optional[float] = None
    quality_notes: Optional[str] = None
    image_data: Optional[str] = None  # base64 encoded image

class MaterialReceptionResponse(BaseModel):
    id: int
    supplier_id: int
    product_name: str
    category: str
    barcode: Optional[str]
    quantity: float
    unit: str
    expiry_date: Optional[date]
    batch_number: Optional[str]
    temperature_on_arrival: Optional[float]
    quality_notes: Optional[str]
    ai_analysis: Optional[dict]
    received_by: int
    received_at: datetime

    class Config:
        from_attributes = True

class ConfigurationUpdate(BaseModel):
    value: str

class ConfigurationResponse(BaseModel):
    id: int
    parameter: str
    value: str
    parent_parameter: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserTemperatureRangeCreate(BaseModel):
    refrigerated_min: Optional[Decimal] = 0.0
    refrigerated_max: Optional[Decimal] = 4.0
    frozen_min: Optional[Decimal] = -25.0
    frozen_max: Optional[Decimal] = -18.0
    ambient_min: Optional[Decimal] = 15.0
    ambient_max: Optional[Decimal] = 25.0

class UserTemperatureRangeResponse(BaseModel):
    id: int
    user_id: int
    refrigerated_min: Decimal
    refrigerated_max: Decimal
    frozen_min: Decimal
    frozen_max: Decimal
    ambient_min: Decimal
    ambient_max: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True