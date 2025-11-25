# AI-HACCP Platform

## Objective

AI-HACCP is a serverless Food Safety Management Platform that automates HACCP compliance for restaurants. It provides temperature monitoring, product tracking, supplier management, and incident reporting through web interface, REST API, and AI integration via Model Context Protocol (MCP).

**Key Benefits:**
- 85% cost reduction vs traditional hosting
- Real-time compliance monitoring
- AI-powered natural language interface
- Multi-tenant architecture
- Automated cost tracking and reporting

## Installation & Configuration

### Prerequisites Check
```bash
# Verify Docker installation
docker --version
docker-compose --version

# If not installed, install Docker:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Automated Installation

1. **Clone and Deploy**:
```bash
git clone https://github.com/your-org/ai-haccp.git
cd ai-haccp
docker-compose up -d
```

2. **Verify Installation**:
```bash
# Check all services are running
docker-compose ps

# Verify API is accessible
curl -f http://localhost:8000/health || echo "API not ready, waiting..."

# Wait for database initialization
sleep 30
```

3. **Test Authentication**:
```bash
# Test login endpoint
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ai-automorph.com","password":"password"}'
```

### Configuration

**Environment Variables** (optional):
```bash
# Create .env file for custom configuration
cat > .env << EOF
DATABASE_URL=postgresql://haccp_user:haccp_password@db:5432/haccp_db
JWT_SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
EOF
```

**SSL/HTTPS Setup** (production):
```bash
# Place SSL certificates in ssl/ directory
mkdir -p ssl
# Copy your certificates:
# ssl/fullchain.pem
# ssl/privkey.pem

# Deploy with HTTPS
docker-compose -f docker-compose.yml -f docker-compose.https.yml up -d
```

### Access Points

- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Default Login**: admin@ai-automorph.com / password

### API Usage

**Authentication**:
```bash
# Get JWT token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ai-automorph.com","password":"password"}' \
  | jq -r '.access_token')
```

**Core Operations**:
```bash
# Log temperature
curl -X POST http://localhost:8000/temperature-logs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location":"Freezer","temperature":-18.5,"equipment_id":"FREEZER_01"}'

# Create product
curl -X POST http://localhost:8000/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Chicken Breast","category":"Meat","allergens":["None"]}'

# Report incident
curl -X POST http://localhost:8000/incidents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Temperature Deviation","description":"Freezer temperature above -15°C","severity":"High"}'
```

### MCP Integration (AI Interface)

**Setup MCP Server**:
```bash
# Install MCP dependencies
pip install mcp

# Configure MCP server
cat > mcp-config.json << EOF
{
  "server": {
    "command": "python",
    "args": ["-m", "ai_haccp.mcp_server"],
    "env": {
      "API_BASE_URL": "http://localhost:8000",
      "API_TOKEN": "$TOKEN"
    }
  }
}
EOF
```

**AI Commands** (via MCP):
- "Log temperature of -18°C in walk-in freezer"
- "Create new supplier for organic vegetables"
- "Report incident about contaminated batch"
- "Show today's temperature logs"
- "Generate compliance report for last week"

### Troubleshooting

**Common Issues**:
```bash
# Database connection issues
docker-compose logs db

# API not responding
docker-compose logs api

# Reset everything
docker-compose down -v
docker-compose up -d

# Check disk space
df -h

# Check memory usage
free -h
```

**Health Checks**:
```bash
# Verify all services
curl http://localhost:8000/health
curl http://localhost:3000

# Database connectivity
docker-compose exec db psql -U haccp_user -d haccp_db -c "SELECT 1;"
```

### Production Deployment

**AWS Lambda** (Serverless):
```bash
# Install serverless dependencies
pip install mangum boto3

# Deploy to AWS
aws lambda create-function --function-name ai-haccp \
  --runtime python3.11 \
  --handler app.handler \
  --zip-file fileb://deployment.zip
```

**Traditional Server**:
```bash
# Production compose file
docker-compose -f docker-compose.prod.yml up -d

# With monitoring
docker-compose -f docker-compose.prod.yml -f docker-compose.monitoring.yml up -d
```

The platform is now ready for use. All HACCP operations are accessible via web interface, REST API, and AI natural language commands through MCP integration.