from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from database import get_db, engine, init_database
from models import User, Organization, UsageLog, TemperatureLog, Product, Supplier, CleaningPlan, RoomCleaning, MaterialReception
from schemas import *

# Serverless compatibility
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    pass

app = FastAPI(title="AI-HACCP Platform", version="1.0.0")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def log_usage(db: Session, user_id: int, org_id: int, action: str, cost: float):
    """Log usage for cost tracking"""
    usage = UsageLog(
        user_id=user_id,
        organization_id=org_id,
        action_type=action,
        resource_used=cost
    )
    db.add(usage)
    db.commit()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/auth/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not pwd_context.verify(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = jwt.encode(
        {"sub": user.id, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY, algorithm=ALGORITHM
    )
    
    log_usage(db, user.id, user.organization_id, "login", 0.001)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.post("/organizations", response_model=OrganizationResponse)
async def create_organization(org: OrganizationCreate, db: Session = Depends(get_db)):
    db_org = Organization(**org.dict())
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        name=user.name,
        role=user.role,
        organization_id=user.organization_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/temperature-logs", response_model=TemperatureLogResponse)
async def create_temperature_log(
    temp_log: TemperatureLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_log = TemperatureLog(
        organization_id=current_user.organization_id,
        recorded_by=current_user.id,
        **temp_log.dict()
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    
    log_usage(db, current_user.id, current_user.organization_id, "temperature_log", 0.002)
    return db_log

@app.get("/temperature-logs", response_model=List[TemperatureLogResponse])
async def get_temperature_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(TemperatureLog).filter(
        TemperatureLog.organization_id == current_user.organization_id
    ).order_by(TemperatureLog.created_at.desc()).limit(100).all()
    
    log_usage(db, current_user.id, current_user.organization_id, "data_query", 0.001)
    return logs

@app.post("/products", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_product = Product(
        organization_id=current_user.organization_id,
        **product.dict()
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    log_usage(db, current_user.id, current_user.organization_id, "product_create", 0.005)
    return db_product

@app.get("/products", response_model=List[ProductResponse])
async def get_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(
        Product.organization_id == current_user.organization_id
    ).all()
    
    log_usage(db, current_user.id, current_user.organization_id, "data_query", 0.001)
    return products

@app.get("/usage-report")
async def get_usage_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get cost usage report for the organization"""
    from sqlalchemy import func
    
    total_cost = db.query(func.sum(UsageLog.resource_used)).filter(
        UsageLog.organization_id == current_user.organization_id
    ).scalar() or 0
    
    monthly_cost = db.query(func.sum(UsageLog.resource_used)).filter(
        UsageLog.organization_id == current_user.organization_id,
        UsageLog.created_at >= datetime.utcnow() - timedelta(days=30)
    ).scalar() or 0
    
    usage_by_type = db.query(
        UsageLog.action_type,
        func.sum(UsageLog.resource_used).label('total_cost'),
        func.count(UsageLog.id).label('count')
    ).filter(
        UsageLog.organization_id == current_user.organization_id
    ).group_by(UsageLog.action_type).all()
    
    return {
        "total_cost": float(total_cost),
        "monthly_cost": float(monthly_cost),
        "usage_breakdown": [
            {"action": item.action_type, "cost": float(item.total_cost), "count": item.count}
            for item in usage_by_type
        ]
    }

@app.post("/cleaning-plans", response_model=CleaningPlanResponse)
async def create_cleaning_plan(
    plan: CleaningPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_plan = CleaningPlan(
        organization_id=current_user.organization_id,
        **plan.dict()
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    
    log_usage(db, current_user.id, current_user.organization_id, "cleaning_plan_create", 0.003)
    return db_plan

@app.get("/cleaning-plans", response_model=List[CleaningPlanResponse])
async def get_cleaning_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plans = db.query(CleaningPlan).filter(
        CleaningPlan.organization_id == current_user.organization_id
    ).all()
    
    log_usage(db, current_user.id, current_user.organization_id, "data_query", 0.001)
    return plans

@app.post("/room-cleaning", response_model=RoomCleaningResponse)
async def mark_room_cleaned(
    cleaning: RoomCleaningCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_cleaning = RoomCleaning(
        organization_id=current_user.organization_id,
        cleaned_by=current_user.id,
        **cleaning.dict()
    )
    db.add(db_cleaning)
    db.commit()
    db.refresh(db_cleaning)
    
    log_usage(db, current_user.id, current_user.organization_id, "room_cleaning", 0.002)
    return db_cleaning

@app.get("/room-cleanings/{plan_id}", response_model=List[RoomCleaningResponse])
async def get_room_cleanings(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cleanings = db.query(RoomCleaning).filter(
        RoomCleaning.organization_id == current_user.organization_id,
        RoomCleaning.cleaning_plan_id == plan_id
    ).order_by(RoomCleaning.cleaned_at.desc()).all()
    
    log_usage(db, current_user.id, current_user.organization_id, "data_query", 0.001)
    return cleanings

@app.get("/help")
async def help_page():
    """Serve help documentation"""
    return {
        "title": "AI-HACCP Help & User Guide",
        "version": "1.0.0",
        "sections": [
            {
                "title": "Getting Started",
                "content": "Login with admin@restaurant.com / password to access the demo"
            },
            {
                "title": "Temperature Monitoring",
                "content": "Log temperatures for food safety compliance. Safe ranges: 0-4°C (fridge), -18 to -15°C (freezer)"
            },
            {
                "title": "AI Assistant",
                "content": "Use natural language commands like 'Log temperature of 3 degrees in walk-in cooler'"
            },
            {
                "title": "Cleaning Management",
                "content": "Create visual cleaning plans and click rooms to mark them as cleaned"
            },
            {
                "title": "Material Reception",
                "content": "AI-powered material reception with barcode scanning and image recognition. Take photos to automatically extract product information."
            }
        ],
        "quick_commands": [
            "Log temperature of 3 degrees in walk-in cooler",
            "Add product Fresh Salmon with fish allergens",
            "Receive 2.5kg chicken breast from supplier 1",
            "Clean kitchen room",
            "What's our compliance status?",
            "Show usage report"
        ]
    }

@app.post("/material-reception", response_model=MaterialReceptionResponse)
async def create_material_reception(
    reception: MaterialReceptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from ai_vision import ai_vision_service
    import base64
    import os
    
    # Process AI image analysis if image provided
    ai_analysis = None
    image_path = None
    
    if reception.image_data:
        try:
            # Analyze image with AI
            ai_result = ai_vision_service.analyze_reception_image(reception.image_data)
            ai_analysis = ai_result
            
            # Save image file
            image_dir = "uploads/reception_images"
            os.makedirs(image_dir, exist_ok=True)
            
            # Decode and save image
            image_data = base64.b64decode(reception.image_data.split(',')[1] if ',' in reception.image_data else reception.image_data)
            image_filename = f"reception_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.jpg"
            image_path = os.path.join(image_dir, image_filename)
            
            with open(image_path, 'wb') as f:
                f.write(image_data)
                
        except Exception as e:
            # Continue without AI analysis if it fails
            ai_analysis = {"error": str(e), "success": False}
    
    # Create reception record
    db_reception = MaterialReception(
        organization_id=current_user.organization_id,
        received_by=current_user.id,
        supplier_id=reception.supplier_id,
        product_name=reception.product_name,
        category=reception.category,
        barcode=reception.barcode,
        quantity=reception.quantity,
        unit=reception.unit,
        expiry_date=reception.expiry_date,
        batch_number=reception.batch_number,
        temperature_on_arrival=reception.temperature_on_arrival,
        quality_notes=reception.quality_notes,
        image_path=image_path,
        ai_analysis=ai_analysis
    )
    
    db.add(db_reception)
    db.commit()
    db.refresh(db_reception)
    
    log_usage(db, current_user.id, current_user.organization_id, "material_reception", 0.008)
    return db_reception

@app.get("/material-receptions", response_model=List[MaterialReceptionResponse])
async def get_material_receptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receptions = db.query(MaterialReception).filter(
        MaterialReception.organization_id == current_user.organization_id
    ).order_by(MaterialReception.received_at.desc()).limit(100).all()
    
    log_usage(db, current_user.id, current_user.organization_id, "data_query", 0.001)
    return receptions

@app.post("/analyze-reception-image")
async def analyze_reception_image(
    image_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from ai_vision import ai_vision_service
    
    try:
        result = ai_vision_service.analyze_reception_image(image_data.get("image", ""))
        log_usage(db, current_user.id, current_user.organization_id, "ai_image_analysis", 0.015)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)