#!/usr/bin/env python3
"""
Create demo user for AI-HACCP platform
"""

from database import SessionLocal, init_database
from models import User, Organization
from passlib.context import CryptContext
from sqlalchemy import text

def create_demo_user():
    # Initialize database
    init_database()
    
    db = SessionLocal()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    try:
        # Check if organization exists
        org = db.query(Organization).filter(Organization.name == "Demo Restaurant").first()
        if not org:
            org = Organization(name="Demo Restaurant", type="restaurant")
            db.add(org)
            db.commit()
            db.refresh(org)
            print("Created demo organization")
        
        # Check if user exists
        user = db.query(User).filter(User.email == "admin@ai-automorph.com").first()
        if not user:
            # Ensure password is within bcrypt limits (72 bytes)
            password = "password"[:72]
            hashed_password = pwd_context.hash(password)
            user = User(
                email="admin@ai-automorph.com",
                password_hash=hashed_password,
                name="Demo Admin",
                role="admin",
                organization_id=org.id
            )
            db.add(user)
            db.commit()
            print("Created demo user: admin@ai-automorph.com / password")
        else:
            # Update password to ensure it's correct
            password = "password"[:72]
            user.password_hash = pwd_context.hash(password)
            db.commit()
            print("Updated demo user password")
        
        # Verify password
        password = "password"[:72]
        if pwd_context.verify(password, user.password_hash):
            print("✅ Password verification successful")
        else:
            print("❌ Password verification failed")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()