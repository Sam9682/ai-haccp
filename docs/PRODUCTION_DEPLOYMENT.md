# AI-HACCP Production Deployment Guide

## 🚀 Quick Production Setup

### 1. Prerequisites
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Environment Configuration
```bash
# Copy and configure environment variables
cp .env.example .env.prod

# Edit production environment
nano .env.prod
```

**Required Environment Variables:**
```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=ai_haccp

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Domain Configuration
DOMAIN=ai-haccp.swautomorph.com
API_URL=https://ai-haccp.swautomorph.com
SSL_EMAIL=admin@swautomorph.com

# Frontend
REACT_APP_API_URL=https://ai-haccp.swautomorph.com
```

### 3. Start Production Environment
```bash
# Build and start production services
make prod
# or
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### 4. Access Your Platform
- **Web Interface**: https://ai-haccp.swautomorph.com
- **API Documentation**: https://ai-haccp.swautomorph.com/docs
- **Demo Login**: admin@ai-automorph.com / password

## 🔧 Detailed Production Setup

### Step 1: Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget nginx certbot python3-certbot-nginx

# Clone repository
git clone <your-repo-url> ai-haccp
cd ai-haccp
```

### Step 2: SSL Certificate Setup
```bash
# Stop nginx if running
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d ai-haccp.swautomorph.com --email admin@swautomorph.com --agree-tos --non-interactive

# Create SSL directory
mkdir -p ssl
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/privkey.pem ssl/
sudo chown -R $USER:$USER ssl/
```

### Step 3: Production Configuration
```bash
# Create production environment file
cat > .env.prod << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=ai_haccp
JWT_SECRET=$(openssl rand -base64 32)
DOMAIN=ai-haccp.swautomorph.com
API_URL=https://ai-haccp.swautomorph.com
REACT_APP_API_URL=https://ai-haccp.swautomorph.com
SSL_EMAIL=admin@swautomorph.com
EOF

# Secure the environment file
chmod 600 .env.prod
```

### Step 4: Update Nginx Configuration for SSL
```bash
# Create SSL-enabled nginx config
cat > nginx-ssl.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:8000;
    }

    upstream frontend {
        server frontend:80;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name ai-haccp.swautomorph.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name ai-haccp.swautomorph.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header Strict-Transport-Security "max-age=63072000" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Image upload routes
        location /api/material-reception {
            limit_req zone=upload burst=5 nodelay;
            client_max_body_size 10M;
            proxy_pass http://api/material-reception;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/analyze-reception-image {
            limit_req zone=upload burst=5 nodelay;
            client_max_body_size 10M;
            proxy_pass http://api/analyze-reception-image;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Serve uploaded images
        location /uploads/ {
            alias /var/www/uploads/;
            expires 1d;
            add_header Cache-Control "public";
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Replace nginx config
cp nginx-ssl.conf nginx.conf
```

### Step 5: Deploy Production Services
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Verify services are running
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Production Monitoring

### Health Checks
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service
docker-compose -f docker-compose.prod.yml logs api
```

### Database Backup
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres ai_haccp > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (add to crontab)
echo "0 2 * * * cd /path/to/ai-haccp && make backup" | crontab -
```

## 🔐 Security Checklist

### Essential Security Steps
- ✅ Change default passwords
- ✅ Use strong JWT secret (32+ characters)
- ✅ Enable SSL/HTTPS
- ✅ Configure firewall (ports 80, 443 only)
- ✅ Regular security updates
- ✅ Database backups
- ✅ Monitor logs for suspicious activity

### Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🚨 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

**SSL certificate issues:**
```bash
# Renew certificate
sudo certbot renew
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/* ssl/
docker-compose -f docker-compose.prod.yml restart nginx
```

**Database connection issues:**
```bash
# Check database
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d ai_haccp -c "SELECT 1;"

# Reset database (⚠️ loses data)
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Performance Optimization

### Resource Limits
```bash
# Add to docker-compose.prod.yml services:
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

### Monitoring Setup
```bash
# Install monitoring tools
docker run -d --name=cadvisor -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  gcr.io/cadvisor/cadvisor:latest
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Maintenance Mode
```bash
# Stop services
docker-compose -f docker-compose.prod.yml stop frontend api

# Show maintenance page
echo "System under maintenance" > maintenance.html
# Configure nginx to serve maintenance.html

# Resume services
docker-compose -f docker-compose.prod.yml start frontend api
```

## 📞 Production Support

### Monitoring URLs
- **Application**: https://ai-haccp.swautomorph.com
- **API Health**: https://ai-haccp.swautomorph.com/health
- **System Metrics**: http://your-server:8080 (cAdvisor)

### Log Locations
- **Application Logs**: `docker-compose logs`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `/var/log/syslog`

### Emergency Contacts
- **Technical Support**: admin@swautomorph.com
- **Emergency Hotline**: 0033619899050