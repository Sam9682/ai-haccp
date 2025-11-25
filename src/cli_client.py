#!/usr/bin/env python3
"""
AI-HACCP CLI Client
Command-line interface for HACCP platform operations
"""

import click
import requests
import json
import os
from datetime import datetime
from tabulate import tabulate

class HACCPClient:
    def __init__(self, base_url="http://ai-haccp.swautomorph.com:9001", token=None):
        self.base_url = base_url
        self.token = token
        self.headers = {"Content-Type": "application/json"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    def login(self, email, password):
        response = requests.post(f"{self.base_url}/auth/login", 
                               json={"email": email, "password": password})
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            self.headers["Authorization"] = f"Bearer {self.token}"
            return True
        return False

    def get(self, endpoint):
        response = requests.get(f"{self.base_url}{endpoint}", headers=self.headers)
        return response.json() if response.status_code == 200 else None

    def post(self, endpoint, data):
        response = requests.post(f"{self.base_url}{endpoint}", 
                               json=data, headers=self.headers)
        return response.json() if response.status_code == 200 else None

client = HACCPClient()

@click.group()
def cli():
    """AI-HACCP Command Line Interface"""
    pass

@cli.command()
@click.option('--email', prompt=True, help='Email address')
@click.option('--password', prompt=True, hide_input=True, help='Password')
def login(email, password):
    """Login to HACCP platform"""
    if client.login(email, password):
        # Save token to file
        with open('.haccp_token', 'w') as f:
            f.write(client.token)
        click.echo("✅ Login successful")
    else:
        click.echo("❌ Login failed")

@cli.command()
@click.option('--location', required=True, help='Location name')
@click.option('--temperature', required=True, type=float, help='Temperature in Celsius')
@click.option('--equipment', help='Equipment ID')
def log_temp(location, temperature, equipment):
    """Log temperature reading"""
    load_token()
    data = {"location": location, "temperature": temperature}
    if equipment:
        data["equipment_id"] = equipment
    
    result = client.post("/temperature-logs", data)
    if result:
        status = "✅ Normal" if result.get("is_within_limits") else "⚠️ Alert"
        click.echo(f"Temperature logged: {location} = {temperature}°C {status}")
    else:
        click.echo("❌ Failed to log temperature")

@cli.command()
@click.option('--limit', default=10, help='Number of logs to show')
def temp_logs(limit):
    """Show recent temperature logs"""
    load_token()
    logs = client.get(f"/temperature-logs")
    if logs:
        table_data = []
        for log in logs[:limit]:
            status = "✅" if log["is_within_limits"] else "⚠️"
            table_data.append([
                log["location"],
                f"{log['temperature']}°C",
                status,
                log["created_at"][:19]
            ])
        click.echo(tabulate(table_data, headers=["Location", "Temp", "Status", "Time"]))
    else:
        click.echo("❌ Failed to fetch logs")

@cli.command()
@click.option('--name', required=True, help='Product name')
@click.option('--category', help='Product category')
@click.option('--allergens', help='Comma-separated allergens')
def add_product(name, category, allergens):
    """Add new product"""
    load_token()
    data = {"name": name}
    if category:
        data["category"] = category
    if allergens:
        data["allergens"] = [a.strip() for a in allergens.split(',')]
    
    result = client.post("/products", data)
    if result:
        click.echo(f"✅ Product '{name}' added successfully")
    else:
        click.echo("❌ Failed to add product")

@cli.command()
def products():
    """List all products"""
    load_token()
    products = client.get("/products")
    if products:
        table_data = []
        for product in products:
            allergens = ", ".join(product.get("allergens", []))
            table_data.append([
                product["name"],
                product.get("category", "N/A"),
                allergens or "None"
            ])
        click.echo(tabulate(table_data, headers=["Name", "Category", "Allergens"]))
    else:
        click.echo("❌ Failed to fetch products")

@cli.command()
@click.option('--room', required=True, help='Room name')
@click.option('--plan-id', required=True, type=int, help='Cleaning plan ID')
@click.option('--notes', help='Cleaning notes')
def clean_room(room, plan_id, notes):
    """Mark room as cleaned"""
    load_token()
    data = {"room_name": room, "cleaning_plan_id": plan_id}
    if notes:
        data["notes"] = notes
    
    result = client.post("/room-cleaning", data)
    if result:
        click.echo(f"✅ Room '{room}' marked as cleaned")
    else:
        click.echo("❌ Failed to mark room as cleaned")

@cli.command()
def status():
    """Show compliance status"""
    load_token()
    report = client.get("/usage-report")
    if report:
        click.echo("🏥 HACCP Compliance Status")
        click.echo(f"Monthly Cost: ${report['monthly_cost']:.4f}")
        click.echo(f"Total Cost: ${report['total_cost']:.4f}")
        click.echo("✅ System operational")
    else:
        click.echo("❌ Failed to get status")

def load_token():
    """Load saved token"""
    if os.path.exists('.haccp_token'):
        with open('.haccp_token', 'r') as f:
            client.token = f.read().strip()
            client.headers["Authorization"] = f"Bearer {client.token}"

if __name__ == '__main__':
    cli()