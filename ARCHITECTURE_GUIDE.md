# AI-HACCP Architecture Guide

## System Architecture Overview

The AI-HACCP platform follows a modern serverless-first architecture with containerized development environment, designed for scalability, maintainability, and cost-effectiveness.

### Core Architecture Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Next)  │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MCP Server    │
                    │   (AI Interface)│
                    │   Port: 8001    │
                    └─────────────────┘
```

### Technology Stack

- **Frontend**: React/Next.js with TypeScript
- **Backend**: FastAPI (Python) with async/await
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Integration**: Model Context Protocol (MCP)
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT tokens
- **API Documentation**: OpenAPI/Swagger

## Standardized Deployment Process

### Universal Application Evolution Framework

This architecture implements a standardized process for application development and deployment that can be applied to any similar project:

#### 1. Configuration-Driven Deployment

**deploy.ini** - Project-specific configuration:
```ini
[project]
name=ai-haccp
description=AI-powered HACCP compliance platform
version=1.0.0

[services]
frontend_port=3000
backend_port=8000
database_port=5432
mcp_port=8001

[database]
name=haccp_db
user=haccp_user
password=haccp_password

[environment]
jwt_secret=your-secret-key
cors_origins=http://localhost:3000
```

#### 2. Universal Deployment Script

**deploy.sh** - Standardized across all applications:
```bash
#!/bin/bash
# Universal deployment script - same for all applications

set -e

# Load configuration
source deploy.ini

echo "Deploying ${project_name}..."

# Pre-deployment checks
docker --version || { echo "Docker not installed"; exit 1; }
docker-compose --version || { echo "Docker Compose not installed"; exit 1; }

# Environment setup
if [ ! -f .env ]; then
    echo "Creating .env from deploy.ini..."
    # Generate .env from deploy.ini
fi

# Build and deploy
docker-compose down -v 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

# Health checks
echo "Waiting for services to start..."
sleep 30

# Verify deployment
curl -f http://localhost:${backend_port}/health || { echo "Backend health check failed"; exit 1; }
curl -f http://localhost:${frontend_port} || { echo "Frontend health check failed"; exit 1; }

echo "Deployment successful!"
```

#### 3. Docker Compose Architecture

**docker-compose.yml** - Service orchestration:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USER}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${DATABASE_PORT}:5432"
    healthcheck:
      test: ["CMD-EXEC", "pg_isready -U ${DATABASE_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@db:5432/${DATABASE_NAME}
      JWT_SECRET_KEY: ${JWT_SECRET}
      CORS_ORIGINS: ${CORS_ORIGINS}
    ports:
      - "${BACKEND_PORT}:8000"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:${BACKEND_PORT}
    ports:
      - "${FRONTEND_PORT}:3000"
    depends_on:
      api:
        condition: service_healthy

  mcp-server:
    build:
      context: ./mcp
      dockerfile: Dockerfile
    environment:
      API_BASE_URL: http://api:8000
      DATABASE_URL: postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@db:5432/${DATABASE_NAME}
    ports:
      - "${MCP_PORT}:8001"
    depends_on:
      api:
        condition: service_healthy

volumes:
  postgres_data:
```

## Q Chat GenAI Integration

### Automated Application Evolution

The platform integrates with Amazon Q Developer to automate application evolution through natural language commands:

#### 1. Code Generation & Modification
```
User: "Add user role management to the authentication system"
Q Chat: Analyzes codebase → Generates role-based auth → Updates API endpoints → Modifies database schema
```

#### 2. Feature Development
```
User: "Create a dashboard for temperature analytics"
Q Chat: Creates React components → Adds API endpoints → Updates database models → Generates tests
```

#### 3. Infrastructure Updates
```
User: "Add Redis caching layer"
Q Chat: Updates docker-compose.yml → Modifies API code → Adds caching logic → Updates deploy.ini
```

### MCP Server Architecture

The Model Context Protocol server enables AI-driven interactions:

```python
# mcp/server.py
class HACCPMCPServer:
    def __init__(self):
        self.api_client = APIClient()
        
    async def handle_temperature_log(self, params):
        """Natural language: 'Log freezer temperature at -18°C'"""
        return await self.api_client.create_temperature_log(params)
        
    async def handle_incident_report(self, params):
        """Natural language: 'Report contamination incident'"""
        return await self.api_client.create_incident(params)
```

## Development Workflow

### 1. Initial Setup
```bash
# Clone template or existing project
git clone <project-repo>
cd <project-name>

# Modify deploy.ini for project specifics
vim deploy.ini

# Deploy using universal script
./deploy.sh
```

### 2. Feature Development with Q Chat
```bash
# Start Q Chat session
q chat

# Natural language development
"Add supplier management module with CRUD operations"
"Implement temperature alert notifications"
"Create compliance reporting dashboard"
```

### 3. Continuous Evolution
- **Configuration Changes**: Update `deploy.ini`
- **Service Updates**: Modify `docker-compose.yml`
- **Deployment**: Run `./deploy.sh`
- **AI Enhancement**: Use Q Chat for feature evolution

## Scalability & Production

### Serverless Deployment
```yaml
# docker-compose.prod.yml
services:
  api:
    image: ${ECR_REGISTRY}/ai-haccp-api:latest
    environment:
      - AWS_LAMBDA_RUNTIME_API=${AWS_LAMBDA_RUNTIME_API}
    deploy:
      resources:
        limits:
          memory: 512M
```

### Multi-Environment Support
```bash
# Environment-specific deployment
./deploy.sh --env production
./deploy.sh --env staging
./deploy.sh --env development
```

## Benefits of This Architecture

### 1. Standardization
- **Same deploy.sh** across all projects
- **Consistent docker-compose** patterns
- **Unified configuration** approach

### 2. AI-Driven Development
- **Natural language** feature requests
- **Automated code generation**
- **Intelligent refactoring**

### 3. Rapid Deployment
- **One-command deployment**
- **Health check automation**
- **Environment consistency**

### 4. Cost Optimization
- **Serverless-ready** architecture
- **Resource-efficient** containers
- **Auto-scaling** capabilities

## Implementation Guidelines

### For New Applications

1. **Copy Universal Files**:
   - `deploy.sh` (no modifications needed)
   - `docker-compose.yml` (template)
   - `.gitignore`, `README.md` templates

2. **Customize Configuration**:
   - Update `deploy.ini` with project specifics
   - Modify service ports and names
   - Set environment variables

3. **Implement Services**:
   - Follow FastAPI backend pattern
   - Use React/Next.js frontend structure
   - Implement MCP server for AI integration

4. **Deploy & Evolve**:
   - Run `./deploy.sh`
   - Use Q Chat for feature development
   - Iterate based on requirements

This architecture ensures consistent, scalable, and AI-enhanced application development across all projects while maintaining simplicity and cost-effectiveness.