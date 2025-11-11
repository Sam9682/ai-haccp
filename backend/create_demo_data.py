#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db, init_database
from models import User, Organization, Product, TemperatureLog, Supplier
import hashlib
from datetime import datetime, timedelta
from decimal import Decimal

def create_demo_data():
    """Create demo data for the AI-HACCP platform"""
    
    # Initialize database
    init_database()
    
    # Get database session
    db = next(get_db())
    
    try:
        # Check if demo organization already exists
        demo_org = db.query(Organization).filter(Organization.name == "Demo Restaurant").first()
        if not demo_org:
            # Create demo organization
            demo_org = Organization(
                name="Demo Restaurant",
                type="restaurant"
            )
            db.add(demo_org)
            db.commit()
            db.refresh(demo_org)
            print(f"Created demo organization: {demo_org.name}")
        
        # Check if demo user already exists
        demo_user = db.query(User).filter(User.email == "admin@lebouzou.com").first()
        if not demo_user:
            # Create demo user
            simple_hash = hashlib.sha256("password".encode()).hexdigest()
            demo_user = User(
                email="admin@lebouzou.com",
                password_hash=simple_hash,
                name="Demo Admin",
                role="admin",
                organization_id=demo_org.id
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print(f"Created demo user: {demo_user.email}")
        
        # Create demo products if they don't exist
        existing_products = db.query(Product).filter(Product.organization_id == demo_org.id).count()
        if existing_products == 0:
            demo_products = [
                Product(
                    organization_id=demo_org.id,
                    name="Fresh Salmon",
                    category="Fish",
                    allergens=["fish"],
                    shelf_life_days=3,
                    storage_temp_min=Decimal("0.0"),
                    storage_temp_max=Decimal("4.0")
                ),
                Product(
                    organization_id=demo_org.id,
                    name="Chicken Breast",
                    category="Poultry",
                    allergens=[],
                    shelf_life_days=5,
                    storage_temp_min=Decimal("0.0"),
                    storage_temp_max=Decimal("4.0")
                ),
                Product(
                    organization_id=demo_org.id,
                    name="Mixed Vegetables",
                    category="Vegetables",
                    allergens=[],
                    shelf_life_days=7,
                    storage_temp_min=Decimal("0.0"),
                    storage_temp_max=Decimal("4.0")
                )
            ]
            
            for product in demo_products:
                db.add(product)
            db.commit()
            print(f"Created {len(demo_products)} demo products")
        
        # Create demo suppliers if they don't exist
        existing_suppliers = db.query(Supplier).filter(Supplier.organization_id == demo_org.id).count()
        if existing_suppliers == 0:
            demo_suppliers = [
                Supplier(
                    organization_id=demo_org.id,
                    name="Fresh Fish Co.",
                    contact_info={"phone": "+33123456789", "email": "contact@freshfish.com"},
                    certification_status="certified",
                    risk_level=1
                ),
                Supplier(
                    organization_id=demo_org.id,
                    name="Local Farm Supplies",
                    contact_info={"phone": "+33987654321", "email": "info@localfarm.com"},
                    certification_status="certified",
                    risk_level=1
                )
            ]
            
            for supplier in demo_suppliers:
                db.add(supplier)
            db.commit()
            print(f"Created {len(demo_suppliers)} demo suppliers")
        
        # Create demo temperature logs if they don't exist
        existing_temp_logs = db.query(TemperatureLog).filter(TemperatureLog.organization_id == demo_org.id).count()
        if existing_temp_logs == 0:
            # Create temperature logs for the last 7 days
            locations = ["Walk-in Cooler", "Freezer", "Prep Area", "Storage Room"]
            
            for i in range(20):  # Create 20 temperature logs
                log_time = datetime.utcnow() - timedelta(hours=i*2)
                location = locations[i % len(locations)]
                
                # Generate realistic temperatures based on location
                if "Freezer" in location:
                    temp = Decimal(str(-18 + (i % 3) - 1))  # -19 to -17
                elif "Cooler" in location:
                    temp = Decimal(str(2 + (i % 3)))  # 2 to 4
                else:
                    temp = Decimal(str(18 + (i % 5)))  # 18 to 22
                
                temp_log = TemperatureLog(
                    organization_id=demo_org.id,
                    location=location,
                    temperature=temp,
                    recorded_by=demo_user.id,
                    equipment_id=f"EQUIP_{location.replace(' ', '_').upper()}",
                    is_within_limits=True,
                    created_at=log_time
                )
                db.add(temp_log)
            
            db.commit()
            print("Created 20 demo temperature logs")
        
        print("Demo data creation completed successfully!")
        
    except Exception as e:
        print(f"Error creating demo data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_data()