# AI-HACCP MCP Integration

The AI-HACCP platform now supports Model Context Protocol (MCP), allowing generative AI to directly interact with food safety management functions.

## MCP Server Features

### Available Tools for AI

1. **log_temperature** - Log temperature readings for food safety monitoring
2. **get_temperature_logs** - Retrieve recent temperature logs
3. **add_product** - Add new products to the HACCP system
4. **get_products** - List all products in the system
5. **report_incident** - Report food safety incidents
6. **log_cleaning** - Log cleaning and sanitation activities
7. **get_compliance_status** - Get overall compliance status and alerts
8. **add_supplier** - Add new suppliers to the system
9. **get_usage_report** - Get cost and usage analytics

### AI Interaction Examples

```
AI: "Log a temperature reading of 3.2°C in the walk-in cooler"
→ Calls log_temperature with location="walk-in cooler", temperature=3.2

AI: "What's our current compliance status?"
→ Calls get_compliance_status to check alerts and incidents

AI: "Add a new product called Fresh Tuna with fish allergens"
→ Calls add_product with appropriate parameters

AI: "Report a temperature excursion incident in the freezer"
→ Calls report_incident with severity and details
```

## Setup Instructions

### 1. Install MCP Dependencies

```bash
pip install -r mcp_requirements.txt
```

### 2. Start the MCP Server

```bash
python mcp_server.py
```

### 3. Configure AI Client

Add to your AI client's MCP configuration:

```json
{
  "mcpServers": {
    "ai-haccp": {
      "command": "python",
      "args": ["mcp_server.py"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:postgres@188.165.71.139:5432/ai_haccp"
      }
    }
  }
}
```

### 4. Test the Integration

```bash
python mcp_client_example.py
```

## AI Use Cases

### Restaurant Staff Assistance
- **Voice Commands**: "Log the freezer temperature as -18 degrees"
- **Natural Language**: "Add chicken breast to our product list with 3-day shelf life"
- **Status Checks**: "Are we compliant with food safety regulations?"

### Automated Monitoring
- **IoT Integration**: Sensors can report temperatures via AI
- **Alert Management**: AI can automatically report incidents
- **Compliance Tracking**: Real-time status monitoring

### Training and Support
- **Interactive Learning**: AI can guide staff through HACCP procedures
- **Best Practices**: AI provides food safety recommendations
- **Documentation**: Automated record keeping and reporting

## Security Considerations

- MCP server runs with limited database permissions
- All actions are logged for audit trails
- User authentication maintained through session management
- Input validation prevents malicious data injection

## Integration with Popular AI Platforms

### Claude Desktop
1. Add MCP server to Claude Desktop configuration
2. AI can directly manage HACCP functions
3. Natural language interface for restaurant staff

### Custom AI Applications
1. Use the MCP client library to connect
2. Build voice-activated HACCP assistants
3. Create automated compliance monitoring systems

## Benefits of MCP Integration

### For Restaurant Staff
- **Natural Language Interface**: Talk to the system in plain English
- **Voice Control**: Hands-free operation in busy kitchens
- **Intelligent Assistance**: AI helps with compliance decisions

### For Management
- **Automated Reporting**: AI generates compliance reports
- **Predictive Analytics**: AI identifies potential issues
- **Cost Optimization**: AI optimizes resource usage

### For Developers
- **Easy Integration**: Standard MCP protocol
- **Extensible**: Add new tools as needed
- **Scalable**: Works with any MCP-compatible AI

## Example AI Conversations

```
User: "The walk-in cooler is reading 6 degrees, is that okay?"
AI: *calls log_temperature and get_compliance_status*
AI: "I've logged the temperature. 6°C is above the safe limit of 4°C. This creates a compliance alert. You should check the cooler immediately and consider moving products to backup storage."

User: "Add salmon to our menu"
AI: *calls add_product*
AI: "I've added salmon to your product list with fish allergen marking and 2-day shelf life. Remember to store between 0-4°C and train staff on allergen protocols."

User: "How are we doing with food safety today?"
AI: *calls get_compliance_status and get_temperature_logs*
AI: "Overall status is good! All recent temperatures are within limits, no open incidents. Your last 10 temperature logs show consistent compliance."
```

## Future Enhancements

- **Multi-language Support**: AI conversations in multiple languages
- **Image Recognition**: AI analyzes food safety photos
- **Predictive Maintenance**: AI predicts equipment failures
- **Regulatory Updates**: AI keeps track of changing regulations