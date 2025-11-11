# AI-HACCP Platform

A comprehensive Food Safety Management Platform for restaurants, built with serverless architecture for cost optimization and scalability.

## Features

### Core HACCP Functionality
- **Temperature Monitoring**: Real-time temperature logging with alerts
- **Product Management**: Complete product catalog with allergen tracking
- **Supplier Management**: Supplier certification and risk assessment
- **Batch Tracking**: Full traceability from supplier to customer
- **Incident Management**: Food safety incident reporting and resolution
- **Cleaning Records**: Sanitation tracking and verification
- **Audit Management**: Compliance audits and documentation

### Cost Management
- **Usage Tracking**: Detailed cost tracking per user and organization
- **Shared Infrastructure**: Cost distribution among platform users
- **Serverless Architecture**: Pay-per-use pricing model
- **Real-time Reporting**: Transparent usage and cost reporting

### Technical Features
- **Multi-tenant**: Support for multiple restaurants/organizations
- **Mobile Responsive**: Works on smartphones and tablets
- **API-First**: RESTful API for integrations
- **Real-time Updates**: Live data synchronization
- **Secure Authentication**: JWT-based authentication

## Architecture

### Backend
- **FastAPI**: High-performance Python web framework
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: ORM for database operations
- **JWT Authentication**: Secure token-based auth
- **Serverless Ready**: Compatible with AWS Lambda

### Frontend
- **React**: Modern web application framework
- **Material-UI**: Professional UI components
- **Responsive Design**: Mobile-first approach
- **Real-time Charts**: Data visualization with Recharts

### Infrastructure
- **Docker**: Containerized deployment
- **PostgreSQL**: Production-ready database
- **Serverless Compatible**: AWS Lambda ready
- **Cost Optimized**: Minimal resource usage

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. **Clone and start the platform**:
```bash
git clone <repository>
cd ai-haccp
docker-compose up -d
```

### HTTPS Deployment

The platform supports HTTPS with SSL certificates:

1. **Deploy with HTTPS**:
```bash
./deploy-https.sh
```

2. **Manual HTTPS setup**:
```bash
# Ensure SSL certificates are in ./ssl/ directory
# - ./ssl/fullchain.pem
# - ./ssl/privkey.pem
docker-compose up -d --build
```

2. **Access the application**:
- Frontend: https://ai-haccp.swautomorph.com
- Backend API: https://ai-haccp.swautomorph.com/api
- API Documentation: https://ai-haccp.swautomorph.com/api/docs

3. **Default Login**:
- Email: admin@ai-automorph.com
- Password: password

### Database Setup

The database is automatically initialized with the schema when you start the containers. The init.sql file contains:
- Complete HACCP data model
- Cost tracking tables
- Sample data and indexes

### API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /users` - Create user
- `POST /organizations` - Create organization

#### HACCP Operations
- `GET/POST /temperature-logs` - Temperature monitoring
- `GET/POST /products` - Product management
- `GET/POST /suppliers` - Supplier management
- `GET/POST /incidents` - Incident reporting

#### Cost Management
- `GET /usage-report` - Usage and cost analytics

## Deployment

### Serverless Deployment (AWS)

1. **Install serverless dependencies**:
```bash
pip install mangum
```

2. **Deploy with AWS Lambda**:
The application is ready for serverless deployment using Mangum adapter.

3. **Database**: Use AWS RDS PostgreSQL for production

### Traditional Deployment

1. **Build containers**:
```bash
docker-compose build
```

2. **Deploy to production**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Cost Model

### Serverless Benefits
- **85% cost reduction** vs traditional hosting
- **Pay-per-use**: Only pay for actual API calls
- **Auto-scaling**: Handles traffic spikes automatically
- **Zero maintenance**: No server management required

### Usage Tracking
- Every API call is logged with cost
- Real-time usage reporting
- Cost sharing among users
- Transparent billing

### Typical Costs (AWS Lambda)
- API Call: $0.001 - $0.005
- Database Query: $0.001 - $0.002
- File Storage: $0.0001 per MB
- Temperature Log: $0.002

## Mobile Compatibility

The platform is fully responsive and works on:
- iOS Safari
- Android Chrome
- Progressive Web App (PWA) ready
- Offline capability (planned)

## API Integration

### REST API
```javascript
// Example API usage
const response = await fetch('https://ai-haccp.swautomorph.com/api/temperature-logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    location: 'Walk-in Freezer',
    temperature: -18.5,
    equipment_id: 'FREEZER_01'
  })
});
```

### Webhook Support (Planned)
- Real-time notifications
- Third-party integrations
- Alert systems

## Security

- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS protection
- Input validation
- Audit logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Documentation & Support

### 📚 User Guides
- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[Complete User Guide](USER_GUIDE.md)** - Comprehensive documentation
- **[Interface Guide](README_INTERFACES.md)** - All access methods (Web, CLI, API, MCP)
- **[MCP Integration](README_MCP.md)** - AI assistant setup
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions

### 🌐 Web Help
- **Built-in Help**: Navigate to "Help & Guide" in the web interface
- **API Documentation**: https://ai-haccp.swautomorph.com/api/docs
- **Interactive Help**: https://ai-haccp.swautomorph.com/help

### 📞 Support
- **Email**: support@ai-haccp.com
- **Emergency Food Safety**: 0033619899050
- **Platform Status**: status.ai-haccp.com
- **GitHub Issues**: Create an issue for bugs or feature requests

## MCP Integration

The platform now supports **Model Context Protocol (MCP)**, allowing generative AI to directly interact with HACCP functions:

- **Natural Language Interface**: Talk to the system in plain English
- **Voice Control**: Hands-free operation for busy kitchens
- **AI-Powered Assistance**: Intelligent compliance guidance
- **Automated Reporting**: AI generates compliance reports

### Available AI Tools
- Temperature logging and monitoring
- Product and supplier management
- Incident reporting and tracking
- Compliance status checking
- Usage and cost analytics

See [README_MCP.md](README_MCP.md) for detailed MCP setup instructions.

## Roadmap

### Phase 1 (Current)
- ✅ Core HACCP functionality
- ✅ Cost tracking
- ✅ Web interface
- ✅ Mobile responsive
- ✅ MCP integration for AI

### Phase 2 (Planned)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] IoT sensor integration
- [ ] Automated alerts
- [ ] Multi-language support

### Phase 3 (Future)
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Blockchain traceability
- [ ] Voice commands
- [ ] Augmented reality features