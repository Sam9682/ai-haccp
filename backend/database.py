from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
import os
import logging

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ai_haccp")

# Extract database name and create connection URL without database
url_parts = DATABASE_URL.rsplit('/', 1)
base_url = url_parts[0]
db_name = url_parts[1] if len(url_parts) > 1 else 'ai_haccp'

def create_database_if_not_exists():
    """Create database if it doesn't exist"""
    try:
        # Connect to postgres database to create our database
        postgres_url = f"{base_url}/postgres"
        temp_engine = create_engine(postgres_url)
        
        with temp_engine.connect() as conn:
            conn.execute(text("COMMIT"))  # End any existing transaction
            
            # Check if database exists
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'"))
            if not result.fetchone():
                conn.execute(text(f"CREATE DATABASE {db_name}"))
                logger.info(f"Database '{db_name}' created successfully")
            else:
                logger.info(f"Database '{db_name}' already exists")
        
        temp_engine.dispose()
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        raise

# Create database if needed
create_database_if_not_exists()

engine = create_engine(DATABASE_URL)
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
        result = db.execute(text("SELECT COUNT(*) FROM organizations")).fetchone()
        
        if result[0] == 0:
            # Insert demo data
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            hashed_password = pwd_context.hash("password")
            
            demo_sql = f"""
            INSERT INTO organizations (name, type) VALUES ('Demo Restaurant', 'restaurant');
            
            INSERT INTO users (email, password_hash, name, role, organization_id) VALUES 
            ('admin@lebouzou.com', '{hashed_password}', 'Demo Admin', 'admin', 1);
            
            INSERT INTO hazard_categories (name, description, severity_level) VALUES
            ('Biological', 'Bacteria, viruses, parasites, fungi', 3),
            ('Chemical', 'Cleaning agents, pesticides, allergens', 2),
            ('Physical', 'Foreign objects, glass, metal fragments', 2),
            ('Allergens', 'Common food allergens', 2);
            
            INSERT INTO products (organization_id, name, category, allergens, shelf_life_days, storage_temp_min, storage_temp_max) VALUES 
            (1, 'Fresh Chicken Breast', 'Meat', '{{}}', 3, 0, 4),
            (1, 'Milk', 'Dairy', '{{milk}}', 7, 0, 4),
            (1, 'Frozen Vegetables', 'Vegetables', '{{}}', 365, -18, -15);
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