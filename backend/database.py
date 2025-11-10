from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_haccp.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_database():
    """Initialize database tables and demo data"""
    from models import Base
    from passlib.context import CryptContext
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Check if demo data exists
        db = SessionLocal()
        try:
            result = db.execute(text("SELECT COUNT(*) FROM organizations")).fetchone()
        except:
            # Tables might not exist yet, create them first
            Base.metadata.create_all(bind=engine)
            result = db.execute(text("SELECT COUNT(*) FROM organizations")).fetchone()
        
        if result[0] == 0:
            # Insert demo data
            # Use a simple hash for demo purposes to avoid bcrypt issues
            import hashlib
            password = "password"
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            
            demo_sql = f"""
            INSERT INTO organizations (name, type) VALUES ('Demo Restaurant', 'restaurant');
            
            INSERT INTO users (email, password_hash, name, role, organization_id) VALUES 
            ('admin@lebouzou.com', '{hashed_password}', 'Demo Admin', 'admin', 1);
            
            INSERT INTO products (organization_id, name, category, allergens, shelf_life_days, storage_temp_min, storage_temp_max) VALUES 
            (1, 'Fresh Chicken Breast', 'Meat', '[]', 3, 0, 4),
            (1, 'Milk', 'Dairy', '["milk"]', 7, 0, 4),
            (1, 'Frozen Vegetables', 'Vegetables', '[]', 365, -18, -15);
            """
            
            for statement in demo_sql.split(';'):
                if statement.strip():
                    db.execute(text(statement))
            
            db.commit()
            logger.info("Demo data inserted successfully")
        
        db.close()
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()