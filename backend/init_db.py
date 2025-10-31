#!/usr/bin/env python3
"""
Standalone database initialization script
Run this script to initialize the database manually if needed
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_database
import logging

logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    print("Initializing AI-HACCP database...")
    try:
        init_database()
        print("Database initialization completed successfully!")
    except Exception as e:
        print(f"Database initialization failed: {e}")
        sys.exit(1)