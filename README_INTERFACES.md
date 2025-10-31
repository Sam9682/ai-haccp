# AI-HACCP Platform Interfaces

The AI-HACCP platform provides multiple ways to interact with the system, making it accessible for different use cases and user preferences.

## 🌐 Web Interface

**Access**: http://localhost:3000

- **Dashboard**: Overview of compliance status and metrics
- **Temperature Logs**: Interactive temperature monitoring
- **Products**: Product management with allergen tracking
- **Material Reception**: AI-powered delivery tracking with image recognition
- **Cleaning Plans**: Visual room layouts with click-to-clean
- **AI Assistant**: Natural language chat interface
- **Usage Reports**: Cost tracking and analytics

## 🤖 AI Chat Interface

**Built-in Web Chat**: Navigate to AI Assistant in the web interface

### Natural Language Commands

```
"Log temperature of 3 degrees in walk-in cooler"
"Add product Fresh Tuna with fish allergens"
"Receive 2.5kg chicken breast from supplier 1"
"Clean kitchen room"
"What's our compliance status?"
"Show usage report"
"List all products"
```

### Features
- **Natural Language Processing**: Understands conversational commands
- **Real-time Responses**: Instant feedback and confirmations
- **Context Awareness**: Remembers conversation context
- **Error Handling**: Helpful suggestions when commands are unclear

## 🔧 REST API

**Base URL**: http://localhost:8000
**Documentation**: http://localhost:8000/docs

### Authentication
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@restaurant.com", "password": "password"}'
```

### Core Endpoints

#### Temperature Management
```bash
# Log temperature
curl -X POST "http://localhost:8000/temperature-logs" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"location": "Walk-in Cooler", "temperature": 2.5}'

# Get temperature logs
curl -X GET "http://localhost:8000/temperature-logs" \
  -H "Authorization: Bearer <token>"
```

#### Product Management
```bash
# Add product
curl -X POST "http://localhost:8000/products" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Fresh Salmon", "category": "Seafood", "allergens": ["fish"]}'

# Get products
curl -X GET "http://localhost:8000/products" \
  -H "Authorization: Bearer <token>"
```

#### Material Reception
```bash
# Record material reception
curl -X POST "http://localhost:8000/material-reception" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"supplier_id": 1, "product_name": "Chicken Breast", "category": "poultry", "quantity": 2.5, "unit": "kg"}'

# Get material receptions
curl -X GET "http://localhost:8000/material-receptions" \
  -H "Authorization: Bearer <token>"

# AI image analysis
curl -X POST "http://localhost:8000/analyze-reception-image" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQ..."}'
```

#### Cleaning Management
```bash
# Create cleaning plan
curl -X POST "http://localhost:8000/cleaning-plans" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Daily Clean", "rooms": [{"name": "Kitchen", "x": 50, "y": 50, "width": 200, "height": 150}], "cleaning_frequency": "daily"}'

# Mark room cleaned
curl -X POST "http://localhost:8000/room-cleaning" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"room_name": "Kitchen", "cleaning_plan_id": 1}'
```

## 💻 Command Line Interface (CLI)

**Installation**:
```bash
pip install -r cli_requirements.txt
chmod +x cli_client.py
```

### Usage Examples

```bash
# Login
./cli_client.py login --email admin@restaurant.com

# Log temperature
./cli_client.py log-temp --location "Walk-in Cooler" --temperature 2.5

# View recent temperature logs
./cli_client.py temp-logs --limit 10

# Add product
./cli_client.py add-product --name "Fresh Salmon" --category "Seafood" --allergens "fish"

# List products
./cli_client.py products

# Mark room as cleaned
./cli_client.py clean-room --room "Kitchen" --plan-id 1

# Check system status
./cli_client.py status
```

### CLI Features
- **Token Management**: Automatic login token storage
- **Formatted Output**: Tables and colored status indicators
- **Error Handling**: Clear error messages and suggestions
- **Batch Operations**: Process multiple commands efficiently

## 🔌 Model Context Protocol (MCP)

**MCP Server**: `python mcp_server.py`

### Available Tools for AI

1. **log_temperature** - Log temperature readings
2. **get_temperature_logs** - Retrieve temperature history
3. **add_product** - Add products with allergen info
4. **get_products** - List all products
5. **report_incident** - Report food safety incidents
6. **log_cleaning** - Log cleaning activities
7. **get_compliance_status** - Check compliance status
8. **add_supplier** - Add new suppliers
9. **get_usage_report** - Get cost analytics
10. **clean_room** - Mark rooms as cleaned
11. **receive_material** - Record material reception with AI analysis

### MCP Configuration

```json
{
  "mcpServers": {
    "ai-haccp": {
      "command": "python",
      "args": ["mcp_server.py"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/ai_haccp"
      }
    }
  }
}
```

### AI Integration Examples

```python
# Claude Desktop, ChatGPT, or custom AI can call:
await session.call_tool("log_temperature", {
    "location": "Walk-in Cooler",
    "temperature": 2.5,
    "equipment_id": "COOLER_01"
})

await session.call_tool("clean_room", {
    "room_name": "Kitchen",
    "cleaning_plan_id": 1,
    "notes": "Deep cleaned and sanitized"
})

await session.call_tool("receive_material", {
    "supplier_id": 1,
    "product_name": "Chicken Breast",
    "category": "poultry",
    "quantity": 2.5,
    "unit": "kg"
})
```

## 📱 Mobile Compatibility

All interfaces are mobile-responsive:

- **Web Interface**: Responsive design works on phones/tablets
- **AI Chat**: Touch-optimized chat interface
- **CLI**: Works on mobile terminals
- **API**: Full API access from mobile apps

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic token refresh
- **Role-based Access**: Different permissions per user role

### API Security
- **CORS Protection**: Configurable cross-origin policies
- **Input Validation**: All inputs validated and sanitized
- **Rate Limiting**: Protection against abuse
- **Audit Logging**: All actions logged for compliance

## 🚀 Integration Examples

### Python Integration
```python
from api_examples import HACCPAPIClient

client = HACCPAPIClient()
client.login("admin@restaurant.com", "password")
client.log_temperature("Freezer", -18.0)
```

### JavaScript Integration
```javascript
const response = await fetch('/api/temperature-logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    location: 'Walk-in Cooler',
    temperature: 2.5
  })
});
```

### cURL Integration
```bash
# One-liner temperature logging
curl -X POST "http://localhost:8000/temperature-logs" \
  -H "Authorization: Bearer $(curl -s -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"password"}' | jq -r '.access_token')" \
  -H "Content-Type: application/json" \
  -d '{"location": "Walk-in Cooler", "temperature": 2.5}'
```

## 🎯 Use Case Examples

### Restaurant Staff
- **Web Interface**: Daily temperature logging, material reception, and cleaning
- **AI Chat**: "Log temp 3°C in cooler", "Receive 2kg chicken", "Clean kitchen"
- **Mobile**: Camera-based material reception and quick status checks

### Management
- **Dashboard**: Compliance overview and reports
- **API**: Integration with existing restaurant systems
- **CLI**: Automated reporting scripts

### Developers
- **REST API**: Build custom applications
- **MCP**: AI-powered integrations
- **CLI**: Automation and scripting

### Auditors
- **Web Reports**: Compliance documentation
- **API Export**: Data extraction for analysis
- **AI Chat**: "Show compliance status for last month"

## 📊 Performance & Costs

### Serverless Benefits
- **API Calls**: $0.001 - $0.005 per request
- **AI Image Analysis**: $0.015 per analysis
- **Material Reception**: $0.008 per record
- **Auto-scaling**: Handles traffic spikes automatically
- **Zero Maintenance**: No server management required
- **Cost Sharing**: Infrastructure costs distributed among users

### Usage Tracking
- Every interface interaction is logged
- Real-time cost monitoring
- Transparent billing per organization
- Usage analytics and optimization suggestions