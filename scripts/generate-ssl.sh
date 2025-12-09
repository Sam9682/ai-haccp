#!/bin/bash

# Generate self-signed SSL certificates for development
echo "🔐 Generating SSL certificates for AI-HACCP..."

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/privkey.pem 2048

# Generate certificate signing request
openssl req -new -key ssl/privkey.pem -out ssl/cert.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=www.swautomorph.com"

# Generate self-signed certificate
openssl x509 -req -days 365 -in ssl/cert.csr -signkey ssl/privkey.pem -out ssl/fullchain.pem

# Clean up CSR file
rm ssl/cert.csr

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates saved to:"
echo "   - ssl/fullchain.pem"
echo "   - ssl/privkey.pem"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted CA like Let's Encrypt."