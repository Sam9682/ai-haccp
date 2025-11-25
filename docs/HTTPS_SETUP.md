# HTTPS Setup Guide for AI-HACCP

This guide explains how to configure AI-HACCP to run with HTTPS and SSL certificates.

## Quick Start

### Option 1: Use Existing Certificates (Recommended)
If you already have SSL certificates:

```bash
# 1. Place your certificates in the ssl/ directory
cp your-fullchain.pem ssl/fullchain.pem
cp your-private-key.pem ssl/privkey.pem

# 2. Deploy with HTTPS
./deploy-https.sh
```

### Option 2: Generate Self-Signed Certificates (Development)
For development or testing:

```bash
# 1. Generate self-signed certificates
./generate-ssl.sh

# 2. Deploy with HTTPS
./deploy-https.sh
```

## Manual Configuration

### 1. SSL Certificate Requirements

Place your SSL certificates in the `ssl/` directory:
- `ssl/fullchain.pem` - Full certificate chain
- `ssl/privkey.pem` - Private key

### 2. Configuration Changes Made

The following files have been updated for HTTPS support:

#### nginx.conf
- Added HTTPS server block listening on port 443
- HTTP to HTTPS redirect on port 80
- SSL configuration with modern security settings
- Updated proxy headers to use HTTPS

#### docker-compose.yml
- Added nginx service with SSL certificate mounts
- Updated environment variables to use HTTPS URLs
- Exposed ports 80 and 443

#### Environment Files
- Updated API URLs to use HTTPS
- Changed from `http://` to `https://` endpoints

### 3. Security Features

The HTTPS configuration includes:
- **TLS 1.2 and 1.3** support
- **Modern cipher suites** for security
- **HSTS headers** to enforce HTTPS
- **Security headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- **HTTP to HTTPS redirect** for all traffic

## Accessing the Application

After deployment, access the application at:
- **Frontend**: https://ai-haccp.swautomorph.com
- **API**: https://ai-haccp.swautomorph.com/api
- **API Docs**: https://ai-haccp.swautomorph.com/api/docs

## Production Deployment

For production environments:

### 1. Use Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d ai-haccp.swautomorph.com

# Copy certificates to ssl directory
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/privkey.pem ssl/

# Set proper permissions
sudo chown $USER:$USER ssl/*.pem
```

### 2. Deploy Production

```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Certificate Renewal

Set up automatic renewal for Let's Encrypt:

```bash
# Add to crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx" | sudo crontab -
```

## Troubleshooting

### Common Issues

1. **Certificate not found error**
   ```bash
   # Check if certificates exist
   ls -la ssl/
   # Should show fullchain.pem and privkey.pem
   ```

2. **Permission denied**
   ```bash
   # Fix certificate permissions
   sudo chown $USER:$USER ssl/*.pem
   chmod 600 ssl/privkey.pem
   chmod 644 ssl/fullchain.pem
   ```

3. **Browser security warnings**
   - For self-signed certificates, browsers will show warnings
   - Click "Advanced" and "Proceed" for development
   - Use trusted CA certificates for production

4. **Port conflicts**
   ```bash
   # Check if ports 80/443 are in use
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

### Logs and Debugging

```bash
# Check nginx logs
docker-compose logs nginx

# Check all service logs
docker-compose logs

# Test SSL configuration
openssl s_client -connect ai-haccp.swautomorph.com:443 -servername ai-haccp.swautomorph.com
```

## Security Best Practices

1. **Use strong certificates**: Prefer certificates from trusted CAs
2. **Regular updates**: Keep SSL certificates up to date
3. **Monitor expiration**: Set up alerts for certificate expiration
4. **Security headers**: The configuration includes modern security headers
5. **Regular backups**: Backup your private keys securely

## API Integration with HTTPS

Update your API calls to use HTTPS:

```javascript
// Before (HTTP)
const response = await fetch('http://ai-haccp.swautomorph.com:8000/api/temperature-logs', {
  // ...
});

// After (HTTPS)
const response = await fetch('https://ai-haccp.swautomorph.com/api/temperature-logs', {
  // ...
});
```

## Support

If you encounter issues with HTTPS setup:
1. Check the troubleshooting section above
2. Review the logs with `docker-compose logs`
3. Ensure your domain DNS points to the correct server
4. Verify firewall settings allow ports 80 and 443

For additional support, refer to the main [README.md](README.md) or create an issue in the repository.