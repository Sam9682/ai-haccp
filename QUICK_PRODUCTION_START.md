# 🚀 Quick Production Start

## One-Command Deployment

```bash
# Clone and deploy in one go
git clone <your-repo> ai-haccp && cd ai-haccp && ./deploy.sh
```

## Manual 3-Step Setup

### Step 1: Environment Setup
```bash
# Copy and edit environment variables
cp .env.example .env.prod

# Edit with your domain and secure passwords
nano .env.prod
```

**Required Changes in `.env.prod`:**
```bash
POSTGRES_PASSWORD=your-secure-password-here
JWT_SECRET=your-32-character-secret-key
DOMAIN=ai-haccp.swautomorph.com
API_URL=https://ai-haccp.swautomorph.com
REACT_APP_API_URL=https://ai-haccp.swautomorph.com
SSL_EMAIL=admin@swautomorph.com
```

### Step 2: SSL Certificate (Optional)
```bash
# For real SSL certificate (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d ai-haccp.swautomorph.com

# Copy certificates
mkdir ssl
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/ai-haccp.swautomorph.com/privkey.pem ssl/
sudo chown -R $USER:$USER ssl/
```

### Step 3: Deploy
```bash
# Start production environment
make prod
# or
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Access Your Platform

- **🌐 Web Interface**: https://ai-haccp.swautomorph.com
- **📚 API Docs**: https://ai-haccp.swautomorph.com/docs
- **🔑 Demo Login**: admin@lebouzou.com / password

## Quick Commands

```bash
# View logs
make logs

# Stop services
make stop

# Backup database
make backup

# Update application
git pull && make prod
```

## Troubleshooting

**Services won't start?**
```bash
docker-compose -f docker-compose.prod.yml logs
```

**SSL issues?**
```bash
# Use self-signed certificate for testing
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem -out ssl/fullchain.pem \
  -subj "/CN=ai-haccp.swautomorph.com"
```

**Need help?**
- Check [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for detailed guide
- Email: admin@swautomorph.com