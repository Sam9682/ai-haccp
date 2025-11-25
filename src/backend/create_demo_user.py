#!/usr/bin/env python3
"""
Create demo user for AI-HACCP platform
"""

from database import SessionLocal, init_database
from models import User, Organization
# from passlib.context import CryptContext  # Not needed for simple hash
from sqlalchemy import text

def create_demo_user():
    # Initialize database
    init_database()
    
    db = SessionLocal()
    # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # Not needed
    
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
            # Use simple hash for demo user to avoid bcrypt issues
            import hashlib
            password = "password"
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
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
            import hashlib
            password = "password"
            user.password_hash = hashlib.sha256(password.encode()).hexdigest()
            db.commit()
            print("Updated demo user password")
        
        # Verify password
        import hashlib
        password = "password"
        expected_hash = hashlib.sha256(password.encode()).hexdigest()
        if expected_hash == user.password_hash:
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