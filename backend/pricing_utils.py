import yaml
import os
from sqlalchemy.orm import Session
from models import Configuration

def init_pricing_config(db: Session):
    """Initialize pricing configuration from YAML if database is empty"""
    from models import Configuration
    
    # Check if pricing config exists in database
    existing_config = db.query(Configuration).filter(
        Configuration.parameter.like("pricing.%")
    ).first()
    
    if not existing_config:
        # Load from YAML and populate database
        config_path = os.path.join(os.path.dirname(__file__), "pricing_config.yaml")
        try:
            with open(config_path, 'r') as file:
                pricing_config = yaml.safe_load(file)
                for action, price in pricing_config.get('pricing', {}).items():
                    config_entry = Configuration(
                        parameter=f"pricing.{action}",
                        value=str(price),
                        parent_parameter="pricing"
                    )
                    db.add(config_entry)
                db.commit()
        except (FileNotFoundError, yaml.YAMLError):
            pass

def get_action_price(db: Session, action_type: str) -> float:
    """Get price for an action from database configuration or YAML fallback"""
    from models import Configuration
    
    # Initialize pricing config if needed
    init_pricing_config(db)
    
    # Get from database configuration table
    config = db.query(Configuration).filter(
        Configuration.parameter == f"pricing.{action_type}"
    ).first()
    
    if config and config.value:
        try:
            return float(config.value)
        except ValueError:
            pass
    
    # Default fallback price
    return 0.001

def log_usage(db: Session, user_id: int, organization_id: int, action_type: str, cost: float = None, execution_time: float = None):
    """Log usage with dynamic pricing based on execution time"""
    from models import UsageLog
    
    if cost is None and execution_time is not None:
        unit_cost = get_action_price(db, action_type)
        cost = execution_time * unit_cost
    elif cost is None:
        cost = get_action_price(db, action_type)
    
    usage_log = UsageLog(
        user_id=user_id,
        organization_id=organization_id,
        action_type=action_type,
        resource_used=cost,
        execution_time=execution_time
    )
    db.add(usage_log)
    db.commit()