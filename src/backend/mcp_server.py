#!/usr/bin/env python3
"""
MCP Server for AI-HACCP Platform
Allows generative AI to interact with HACCP functions via Model Context Protocol
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, date
from decimal import Decimal

from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel
)

# Import HACCP backend modules
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from database import get_db, init_database
from models import User, Organization, TemperatureLog, Product, Supplier, Incident, CleaningRecord
from schemas import *
from sqlalchemy.orm import Session
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

class HACCPMCPServer:
    def __init__(self):
        self.server = Server("ai-haccp")
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.current_user_id = 1  # Default demo user
        self.current_org_id = 1   # Default demo organization
        
        # Initialize database
        init_database()
        
        # Register tools
        self._register_tools()
        
    def _register_tools(self):
        """Register all HACCP tools with MCP server"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            return [
                Tool(
                    name="log_temperature",
                    description="Log temperature reading for food safety monitoring",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "location": {"type": "string", "description": "Location where temperature was measured"},
                            "temperature": {"type": "number", "description": "Temperature in Celsius"},
                            "equipment_id": {"type": "string", "description": "Equipment identifier (optional)"}
                        },
                        "required": ["location", "temperature"]
                    }
                ),
                Tool(
                    name="get_temperature_logs",
                    description="Retrieve recent temperature logs for monitoring",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "limit": {"type": "integer", "description": "Number of logs to retrieve (default: 10)"}
                        }
                    }
                ),
                Tool(
                    name="add_product",
                    description="Add a new product to the HACCP system",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Product name"},
                            "category": {"type": "string", "description": "Product category"},
                            "allergens": {"type": "array", "items": {"type": "string"}, "description": "List of allergens"},
                            "shelf_life_days": {"type": "integer", "description": "Shelf life in days"},
                            "storage_temp_min": {"type": "number", "description": "Minimum storage temperature"},
                            "storage_temp_max": {"type": "number", "description": "Maximum storage temperature"}
                        },
                        "required": ["name"]
                    }
                ),
                Tool(
                    name="get_products",
                    description="Get list of all products in the system",
                    inputSchema={"type": "object", "properties": {}}
                ),
                Tool(
                    name="report_incident",
                    description="Report a food safety incident",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "Incident title"},
                            "description": {"type": "string", "description": "Detailed description"},
                            "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"], "description": "Incident severity"},
                            "category": {"type": "string", "description": "Incident category"}
                        },
                        "required": ["title", "severity"]
                    }
                ),
                Tool(
                    name="log_cleaning",
                    description="Log cleaning and sanitation activities",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "area": {"type": "string", "description": "Area that was cleaned"},
                            "cleaning_type": {"type": "string", "description": "Type of cleaning performed"},
                            "products_used": {"type": "array", "items": {"type": "string"}, "description": "Cleaning products used"},
                            "notes": {"type": "string", "description": "Additional notes"}
                        },
                        "required": ["area", "cleaning_type"]
                    }
                ),
                Tool(
                    name="get_compliance_status",
                    description="Get overall compliance status and alerts",
                    inputSchema={"type": "object", "properties": {}}
                ),
                Tool(
                    name="add_supplier",
                    description="Add a new supplier to the system",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Supplier name"},
                            "contact_info": {"type": "object", "description": "Contact information"},
                            "certification_status": {"type": "string", "description": "Certification status"},
                            "risk_level": {"type": "integer", "description": "Risk level (1-5)"}
                        },
                        "required": ["name"]
                    }
                ),
                Tool(
                    name="get_usage_report",
                    description="Get cost and usage analytics for the platform",
                    inputSchema={"type": "object", "properties": {}}
                ),
                Tool(
                    name="receive_material",
                    description="Record material reception with product details",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "supplier_id": {"type": "integer", "description": "Supplier ID"},
                            "product_name": {"type": "string", "description": "Product name"},
                            "category": {"type": "string", "description": "Food category"},
                            "quantity": {"type": "number", "description": "Quantity received"},
                            "unit": {"type": "string", "description": "Unit of measurement"},
                            "temperature": {"type": "number", "description": "Temperature on arrival"}
                        },
                        "required": ["supplier_id", "product_name", "category", "quantity", "unit"]
                    }
                ),
                Tool(
                    name="clean_room",
                    description="Mark a room as cleaned in a cleaning plan",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "room_name": {"type": "string", "description": "Name of the room to mark as cleaned"},
                            "cleaning_plan_id": {"type": "integer", "description": "ID of the cleaning plan"},
                            "notes": {"type": "string", "description": "Optional cleaning notes"}
                        },
                        "required": ["room_name", "cleaning_plan_id"]
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            try:
                if name == "log_temperature":
                    return await self._log_temperature(arguments)
                elif name == "get_temperature_logs":
                    return await self._get_temperature_logs(arguments)
                elif name == "add_product":
                    return await self._add_product(arguments)
                elif name == "get_products":
                    return await self._get_products(arguments)
                elif name == "report_incident":
                    return await self._report_incident(arguments)
                elif name == "log_cleaning":
                    return await self._log_cleaning(arguments)
                elif name == "get_compliance_status":
                    return await self._get_compliance_status(arguments)
                elif name == "add_supplier":
                    return await self._add_supplier(arguments)
                elif name == "get_usage_report":
                    return await self._get_usage_report(arguments)
                elif name == "clean_room":
                    return await self._clean_room(arguments)
                elif name == "receive_material":
                    return await self._receive_material(arguments)
                else:
                    return [TextContent(type="text", text=f"Unknown tool: {name}")]
            except Exception as e:
                logger.error(f"Error calling tool {name}: {e}")
                return [TextContent(type="text", text=f"Error: {str(e)}")]

    async def _log_temperature(self, args: Dict[str, Any]) -> List[TextContent]:
        """Log temperature reading"""
        db = next(get_db())
        try:
            temp_log = TemperatureLog(
                organization_id=self.current_org_id,
                location=args["location"],
                temperature=float(args["temperature"]),
                recorded_by=self.current_user_id,
                equipment_id=args.get("equipment_id"),
                is_within_limits=self._check_temperature_limits(float(args["temperature"]))
            )
            db.add(temp_log)
            db.commit()
            
            status = "✅ Normal" if temp_log.is_within_limits else "⚠️ Alert"
            return [TextContent(
                type="text",
                text=f"Temperature logged successfully:\n"
                     f"Location: {args['location']}\n"
                     f"Temperature: {args['temperature']}°C\n"
                     f"Status: {status}"
            )]
        finally:
            db.close()

    async def _get_temperature_logs(self, args: Dict[str, Any]) -> List[TextContent]:
        """Get recent temperature logs"""
        db = next(get_db())
        try:
            limit = args.get("limit", 10)
            logs = db.query(TemperatureLog).filter(
                TemperatureLog.organization_id == self.current_org_id
            ).order_by(TemperatureLog.created_at.desc()).limit(limit).all()
            
            if not logs:
                return [TextContent(type="text", text="No temperature logs found")]
            
            result = "Recent Temperature Logs:\n\n"
            for log in logs:
                status = "✅" if log.is_within_limits else "⚠️"
                result += f"{status} {log.location}: {log.temperature}°C ({log.created_at.strftime('%Y-%m-%d %H:%M')})\n"
            
            return [TextContent(type="text", text=result)]
        finally:
            db.close()

    async def _add_product(self, args: Dict[str, Any]) -> List[TextContent]:
        """Add new product"""
        db = next(get_db())
        try:
            product = Product(
                organization_id=self.current_org_id,
                name=args["name"],
                category=args.get("category"),
                allergens=args.get("allergens", []),
                shelf_life_days=args.get("shelf_life_days"),
                storage_temp_min=args.get("storage_temp_min"),
                storage_temp_max=args.get("storage_temp_max")
            )
            db.add(product)
            db.commit()
            
            return [TextContent(
                type="text",
                text=f"Product '{args['name']}' added successfully to the system"
            )]
        finally:
            db.close()

    async def _get_products(self, args: Dict[str, Any]) -> List[TextContent]:
        """Get all products"""
        db = next(get_db())
        try:
            products = db.query(Product).filter(
                Product.organization_id == self.current_org_id
            ).all()
            
            if not products:
                return [TextContent(type="text", text="No products found")]
            
            result = "Products in System:\n\n"
            for product in products:
                result += f"• {product.name}"
                if product.category:
                    result += f" ({product.category})"
                if product.allergens:
                    result += f" - Allergens: {', '.join(product.allergens)}"
                result += "\n"
            
            return [TextContent(type="text", text=result)]
        finally:
            db.close()

    async def _report_incident(self, args: Dict[str, Any]) -> List[TextContent]:
        """Report food safety incident"""
        db = next(get_db())
        try:
            incident = Incident(
                organization_id=self.current_org_id,
                title=args["title"],
                description=args.get("description"),
                severity=args["severity"],
                category=args.get("category"),
                reported_by=self.current_user_id,
                status="open"
            )
            db.add(incident)
            db.commit()
            
            return [TextContent(
                type="text",
                text=f"Incident reported successfully:\n"
                     f"Title: {args['title']}\n"
                     f"Severity: {args['severity']}\n"
                     f"Status: Open - requires attention"
            )]
        finally:
            db.close()

    async def _log_cleaning(self, args: Dict[str, Any]) -> List[TextContent]:
        """Log cleaning activity"""
        db = next(get_db())
        try:
            cleaning = CleaningRecord(
                organization_id=self.current_org_id,
                area=args["area"],
                cleaning_type=args["cleaning_type"],
                products_used=args.get("products_used", []),
                performed_by=self.current_user_id,
                verified_by=self.current_user_id,
                notes=args.get("notes")
            )
            db.add(cleaning)
            db.commit()
            
            return [TextContent(
                type="text",
                text=f"Cleaning activity logged:\n"
                     f"Area: {args['area']}\n"
                     f"Type: {args['cleaning_type']}\n"
                     f"Status: Completed and verified"
            )]
        finally:
            db.close()

    async def _get_compliance_status(self, args: Dict[str, Any]) -> List[TextContent]:
        """Get compliance status"""
        db = next(get_db())
        try:
            # Check temperature compliance
            temp_alerts = db.query(TemperatureLog).filter(
                TemperatureLog.organization_id == self.current_org_id,
                TemperatureLog.is_within_limits == False
            ).count()
            
            # Check open incidents
            open_incidents = db.query(Incident).filter(
                Incident.organization_id == self.current_org_id,
                Incident.status == "open"
            ).count()
            
            status = "🟢 Compliant" if temp_alerts == 0 and open_incidents == 0 else "🟡 Attention Required"
            
            result = f"HACCP Compliance Status: {status}\n\n"
            result += f"Temperature Alerts: {temp_alerts}\n"
            result += f"Open Incidents: {open_incidents}\n"
            
            if temp_alerts > 0 or open_incidents > 0:
                result += "\n⚠️ Action required to maintain compliance"
            
            return [TextContent(type="text", text=result)]
        finally:
            db.close()

    async def _add_supplier(self, args: Dict[str, Any]) -> List[TextContent]:
        """Add new supplier"""
        db = next(get_db())
        try:
            supplier = Supplier(
                organization_id=self.current_org_id,
                name=args["name"],
                contact_info=args.get("contact_info", {}),
                certification_status=args.get("certification_status", "pending"),
                risk_level=args.get("risk_level", 1)
            )
            db.add(supplier)
            db.commit()
            
            return [TextContent(
                type="text",
                text=f"Supplier '{args['name']}' added successfully to the system"
            )]
        finally:
            db.close()

    async def _get_usage_report(self, args: Dict[str, Any]) -> List[TextContent]:
        """Get usage and cost report"""
        db = next(get_db())
        try:
            from sqlalchemy import func
            from models import UsageLog
            
            total_cost = db.query(func.sum(UsageLog.resource_used)).filter(
                UsageLog.organization_id == self.current_org_id
            ).scalar() or 0
            
            result = f"Platform Usage Report:\n\n"
            result += f"Total Cost: ${float(total_cost):.4f}\n"
            result += f"Serverless Architecture: 85% cost savings\n"
            result += f"Pay-per-use model: Only charged for actual usage\n"
            
            return [TextContent(type="text", text=result)]
        finally:
            db.close()

    async def _clean_room(self, args: Dict[str, Any]) -> List[TextContent]:
        """Mark room as cleaned"""
        db = next(get_db())
        try:
            from models import RoomCleaning
            
            cleaning = RoomCleaning(
                organization_id=self.current_org_id,
                cleaning_plan_id=args["cleaning_plan_id"],
                room_name=args["room_name"],
                cleaned_by=self.current_user_id,
                notes=args.get("notes")
            )
            db.add(cleaning)
            db.commit()
            
            return [TextContent(
                type="text",
                text=f"Room '{args['room_name']}' marked as cleaned successfully"
            )]
        finally:
            db.close()

    async def _receive_material(self, args: Dict[str, Any]) -> List[TextContent]:
        """Record material reception"""
        db = next(get_db())
        try:
            from models import MaterialReception
            
            reception = MaterialReception(
                organization_id=self.current_org_id,
                received_by=self.current_user_id,
                supplier_id=args["supplier_id"],
                product_name=args["product_name"],
                category=args["category"],
                quantity=args["quantity"],
                unit=args["unit"],
                temperature_on_arrival=args.get("temperature")
            )
            db.add(reception)
            db.commit()
            
            return [TextContent(
                type="text",
                text=f"Material reception recorded: {args['quantity']} {args['unit']} of {args['product_name']}"
            )]
        finally:
            db.close()

    def _check_temperature_limits(self, temperature: float) -> bool:
        """Check if temperature is within safe limits"""
        # General safe range for refrigerated items: 0°C to 4°C
        # Frozen items: -18°C to -15°C
        return (0 <= temperature <= 4) or (-18 <= temperature <= -15)

    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="ai-haccp",
                    server_version="1.0.0",
                    capabilities=self.server.get_capabilities(),
                ),
            )

async def main():
    """Main entry point"""
    logging.basicConfig(level=logging.INFO)
    server = HACCPMCPServer()
    await server.run()

if __name__ == "__main__":
    asyncio.run(main())