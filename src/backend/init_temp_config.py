#!/usr/bin/env python3
"""Initialize temperature range configuration in database"""

from database import get_db, init_database
from models import Configuration
import yaml

def init_temperature_config():
    """Initialize temperature configuration from YAML if not exists in database"""
    init_database()
    
    db = next(get_db())
    
    # Check if temperature config already exists
    existing = db.query(Configuration).filter(
        Configuration.parameter.like('temperature_%')
    ).first()
    
    if existing:
        print("Temperature configuration already exists in database")
        return
    
    # Load from YAML
    try:
        with open('pricing_config.yaml', 'r') as f:
            config = yaml.safe_load(f)
            temp_ranges = config.get('temperature_ranges', {})
    except:
        temp_ranges = {
            'refrigerated_min': -18,
            'refrigerated_max': 4,
            'frozen_min': -25,
            'frozen_max': -18,
            'ambient_min': 15,
            'ambient_max': 25
        }
    
    # Insert temperature ranges into database
    for param_name, value in temp_ranges.items():
        param_name = f"temperature_{param_name}"
        config_param = Configuration(
            parameter=param_name,
            value=str(value)
        )
        db.add(config_param)
    
    db.commit()
    print(f"Initialized {len(temp_ranges)} temperature configuration parameters")

if __name__ == "__main__":
    init_temperature_config()