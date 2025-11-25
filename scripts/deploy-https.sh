#!/bin/bash

# AI-HACCP HTTPS Deployment Script
echo "🔒 Deploying AI-HACCP with HTTPS support..."

# Check if SSL certificates exist
if [ ! -f "./ssl/fullchain.pem" ] || [ ! -f "./ssl/privkey.pem" ]; then
    echo "❌ SSL certificates not found in ./ssl/ directory"
    echo "Please ensure you have:"
    echo "  - ./ssl/fullchain.pem"
    echo "  - ./ssl/privkey.pem"
    exit 1
fi

echo "✅ SSL certificates found"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start with HTTPS
echo "🚀 Starting AI-HACCP with HTTPS..."
docker-compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 AI-HACCP is now available at:"
    echo "   HTTPS: https://ai-haccp.swautomorph.com"
    echo "   HTTP:  http://ai-haccp.swautomorph.com (redirects to HTTPS)"
    echo ""
    echo "📚 API Documentation: https://ai-haccp.swautomorph.com/api/docs"
    echo ""
    echo "🔐 Default Login:"
    echo "   Email: admin@ai-automorph.com"
    echo "   Password: password"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi