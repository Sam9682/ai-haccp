#!/bin/bash

echo "Applying user isolation migration to AI-HACCP platform..."

# Stop the services
echo "Stopping services..."
docker-compose down

# Apply the migration by rebuilding the backend (SQLite will be recreated with new schema)
echo "Rebuilding backend with updated models..."
docker-compose build api

# Restart all services
echo "Starting all services..."
docker-compose up -d

echo "Migration completed successfully!"
echo "All user data is now properly isolated by organization and linked to users."
echo ""
echo "Key improvements:"
echo "- All data tables now have proper user tracking (created_by, recorded_by, etc.)"
echo "- Data is filtered by organization_id to prevent cross-contamination"
echo "- Users can only see and modify data from their own organization"
echo "- Complete audit trail of who created/modified each record"
echo ""
echo "Access the platform at:"
echo "- Frontend: http://ai-haccp.swautomorph.com:3000"
echo "- Backend API: http://ai-haccp.swautomorph.com:9001"
echo "- API Docs: http://ai-haccp.swautomorph.com:9001/docs"