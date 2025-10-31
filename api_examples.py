#!/usr/bin/env python3
"""
AI-HACCP API Usage Examples
Demonstrates how to interact with the platform via REST API
"""

import requests
import json
from datetime import datetime

class HACCPAPIClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.token = None
        self.headers = {"Content-Type": "application/json"}

    def login(self, email, password):
        """Login and get access token"""
        response = requests.post(f"{self.base_url}/auth/login", 
                               json={"email": email, "password": password})
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            self.headers["Authorization"] = f"Bearer {self.token}"
            return True
        return False

    def log_temperature(self, location, temperature, equipment_id=None):
        """Log temperature reading"""
        data = {
            "location": location,
            "temperature": temperature,
            "equipment_id": equipment_id
        }
        response = requests.post(f"{self.base_url}/temperature-logs", 
                               json=data, headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def get_temperature_logs(self):
        """Get all temperature logs"""
        response = requests.get(f"{self.base_url}/temperature-logs", 
                              headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def add_product(self, name, category=None, allergens=None):
        """Add new product"""
        data = {"name": name}
        if category:
            data["category"] = category
        if allergens:
            data["allergens"] = allergens
        
        response = requests.post(f"{self.base_url}/products", 
                               json=data, headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def get_products(self):
        """Get all products"""
        response = requests.get(f"{self.base_url}/products", 
                              headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def create_cleaning_plan(self, name, rooms, frequency="daily"):
        """Create cleaning plan"""
        data = {
            "name": name,
            "rooms": rooms,
            "cleaning_frequency": frequency
        }
        response = requests.post(f"{self.base_url}/cleaning-plans", 
                               json=data, headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def mark_room_cleaned(self, room_name, plan_id, notes=None):
        """Mark room as cleaned"""
        data = {
            "room_name": room_name,
            "cleaning_plan_id": plan_id,
            "notes": notes
        }
        response = requests.post(f"{self.base_url}/room-cleaning", 
                               json=data, headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def get_usage_report(self):
        """Get usage and cost report"""
        response = requests.get(f"{self.base_url}/usage-report", 
                              headers=self.headers)
        return response.json() if response.status_code == 200 else None

def main():
    """Example usage of the API"""
    client = HACCPAPIClient()
    
    # Login
    print("🔐 Logging in...")
    if client.login("admin@restaurant.com", "password"):
        print("✅ Login successful")
    else:
        print("❌ Login failed")
        return

    # Log temperature
    print("\n🌡️ Logging temperature...")
    temp_result = client.log_temperature("Walk-in Cooler", 2.5, "COOLER_01")
    if temp_result:
        status = "✅ Normal" if temp_result["is_within_limits"] else "⚠️ Alert"
        print(f"Temperature logged: {temp_result['location']} = {temp_result['temperature']}°C {status}")

    # Add product
    print("\n🥘 Adding product...")
    product_result = client.add_product("Fresh Salmon", "Seafood", ["fish"])
    if product_result:
        print(f"Product added: {product_result['name']} ({product_result['category']})")

    # Create cleaning plan
    print("\n🧹 Creating cleaning plan...")
    rooms = [
        {"name": "Kitchen", "x": 50, "y": 50, "width": 200, "height": 150},
        {"name": "Storage", "x": 300, "y": 50, "width": 100, "height": 100}
    ]
    plan_result = client.create_cleaning_plan("Daily Kitchen Clean", rooms)
    if plan_result:
        print(f"Cleaning plan created: {plan_result['name']}")
        
        # Mark room as cleaned
        print("\n✨ Marking room as cleaned...")
        clean_result = client.mark_room_cleaned("Kitchen", plan_result['id'], "Deep cleaned")
        if clean_result:
            print(f"Room cleaned: {clean_result['room_name']}")

    # Get usage report
    print("\n📊 Getting usage report...")
    usage_result = client.get_usage_report()
    if usage_result:
        print(f"Monthly cost: ${usage_result['monthly_cost']:.4f}")
        print(f"Total cost: ${usage_result['total_cost']:.4f}")

    # Get recent temperature logs
    print("\n📋 Recent temperature logs:")
    logs = client.get_temperature_logs()
    if logs:
        for log in logs[:5]:  # Show last 5
            status = "✅" if log["is_within_limits"] else "⚠️"
            print(f"{status} {log['location']}: {log['temperature']}°C ({log['created_at'][:19]})")

    print("\n🎉 API examples completed!")

if __name__ == "__main__":
    main()