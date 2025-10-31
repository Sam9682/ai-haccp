#!/usr/bin/env python3
"""
Example MCP client for testing AI-HACCP MCP server
Demonstrates how generative AI can interact with HACCP functions
"""

import asyncio
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_haccp_mcp():
    """Test the HACCP MCP server functionality"""
    
    # Connect to the MCP server
    server_params = StdioServerParameters(
        command="python",
        args=["mcp_server.py"]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the session
            await session.initialize()
            
            # List available tools
            tools = await session.list_tools()
            print("Available HACCP Tools:")
            for tool in tools.tools:
                print(f"- {tool.name}: {tool.description}")
            print()
            
            # Test temperature logging
            print("Testing temperature logging...")
            result = await session.call_tool(
                "log_temperature",
                {
                    "location": "Walk-in Cooler",
                    "temperature": 2.5,
                    "equipment_id": "COOLER_01"
                }
            )
            print(f"Result: {result.content[0].text}")
            print()
            
            # Test product addition
            print("Testing product addition...")
            result = await session.call_tool(
                "add_product",
                {
                    "name": "Fresh Salmon",
                    "category": "Seafood",
                    "allergens": ["fish"],
                    "shelf_life_days": 2,
                    "storage_temp_min": 0,
                    "storage_temp_max": 4
                }
            )
            print(f"Result: {result.content[0].text}")
            print()
            
            # Test incident reporting
            print("Testing incident reporting...")
            result = await session.call_tool(
                "report_incident",
                {
                    "title": "Temperature Excursion Detected",
                    "description": "Freezer temperature rose above -15°C for 30 minutes",
                    "severity": "medium",
                    "category": "temperature"
                }
            )
            print(f"Result: {result.content[0].text}")
            print()
            
            # Test compliance status
            print("Testing compliance status...")
            result = await session.call_tool("get_compliance_status", {})
            print(f"Result: {result.content[0].text}")
            print()
            
            # Test getting temperature logs
            print("Testing temperature log retrieval...")
            result = await session.call_tool("get_temperature_logs", {"limit": 5})
            print(f"Result: {result.content[0].text}")

if __name__ == "__main__":
    asyncio.run(test_haccp_mcp())