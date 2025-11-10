# AI-HACCP Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 🔐 Login Problems

**Issue**: Can't log in to the platform
```
❌ "Invalid credentials" error
❌ Login page keeps refreshing
❌ "User not found" message
```

**Solutions**:
1. **Check credentials**:
   - Email: `admin@lebouzou.com`
   - Password: `password`
   - Ensure no extra spaces
   - Check caps lock is off

2. **Clear browser cache**:
   ```bash
   # Chrome: Ctrl+Shift+Delete
   # Firefox: Ctrl+Shift+Delete
   # Safari: Cmd+Option+E
   ```

3. **Try different browser**:
   - Chrome (recommended)
   - Firefox
   - Safari
   - Edge

4. **Check database**:
   ```bash
   docker-compose logs postgres
   docker-compose restart api
   ```

### 🌡️ Temperature Logging Issues

**Issue**: Temperature alerts or logging failures
```
❌ Red temperature warnings
❌ "Failed to log temperature" error
❌ Temperature not saving
```

**Solutions**:
1. **Check temperature ranges**:
   - Fridge: 0°C to 4°C ✅
   - Freezer: -18°C to -15°C ✅
   - Above 4°C or below -18°C = Alert ⚠️

2. **Verify input format**:
   - Use decimal numbers: `2.5` not `2,5`
   - Celsius only (no Fahrenheit)
   - Location name required

3. **Check equipment immediately** if red alert:
   - Verify actual temperature with calibrated thermometer
   - Check door seals
   - Inspect refrigeration unit
   - Document corrective actions

### 🧹 Cleaning Plan Problems

**Issue**: Cleaning interface not working
```
❌ Can't draw rooms
❌ Rooms not clickable
❌ Canvas not responding
```

**Solutions**:
1. **Browser compatibility**:
   - Use Chrome or Firefox (best canvas support)
   - Enable JavaScript
   - Disable ad blockers on the site

2. **Drawing rooms**:
   - Click and drag to create rectangles
   - Minimum size: 20x20 pixels
   - Release mouse to finish drawing
   - Enter room name when prompted

3. **Clicking rooms**:
   - Click inside room boundaries
   - Wait for color change (green = cleaned)
   - Refresh page if unresponsive

### 🤖 AI Assistant Issues

**Issue**: AI not understanding commands
```
❌ "I don't understand" responses
❌ Wrong actions performed
❌ AI not responding
```

**Solutions**:
1. **Use specific language**:
   ```
   ✅ "Log temperature of 3 degrees in walk-in cooler"
   ❌ "It's cold in there"
   
   ✅ "Add product Fresh Salmon with fish allergens"
   ❌ "New fish item"
   
   ✅ "Clean kitchen room"
   ❌ "Kitchen is done"
   ```

2. **Include key information**:
   - Numbers: "3 degrees", "plan ID 1"
   - Locations: "walk-in cooler", "kitchen"
   - Specific actions: "log", "add", "clean", "show"

3. **Try alternative phrasing**:
   ```
   "Log temp 2.5°C in freezer"
   "Record temperature reading"
   "Mark kitchen as cleaned"
   "What's our status?"
   ```

### 📱 Mobile Issues

**Issue**: Platform not working on mobile
```
❌ Buttons too small
❌ Forms not submitting
❌ Canvas not working on touch
```

**Solutions**:
1. **Use mobile browser**:
   - Chrome Mobile (recommended)
   - Safari Mobile
   - Firefox Mobile

2. **Orientation**:
   - Portrait: Better for forms and lists
   - Landscape: Better for cleaning plans

3. **Touch interactions**:
   - Tap firmly on room areas
   - Use pinch-to-zoom if needed
   - Enable JavaScript

### 🔌 API & CLI Issues

**Issue**: API calls failing or CLI not working
```
❌ "Connection refused" errors
❌ "Invalid token" messages
❌ CLI commands not found
```

**Solutions**:
1. **Check services running**:
   ```bash
   docker-compose ps
   # Should show api, postgres, frontend as "Up"
   ```

2. **Restart services**:
   ```bash
   docker-compose restart
   ```

3. **CLI setup**:
   ```bash
   pip install -r cli_requirements.txt
   chmod +x cli_client.py
   ./cli_client.py login --email admin@lebouzou.com
   ```

4. **API authentication**:
   ```bash
   # Get fresh token
   curl -X POST "http://188.165.71.139:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@lebouzou.com","password":"password"}'
   ```

### 💾 Database Issues

**Issue**: Data not saving or loading
```
❌ "Database connection failed"
❌ Data disappearing after restart
❌ Slow loading times
```

**Solutions**:
1. **Check database status**:
   ```bash
   docker-compose logs postgres
   docker-compose exec postgres psql -U postgres -d ai_haccp -c "\dt"
   ```

2. **Restart database**:
   ```bash
   docker-compose restart postgres
   docker-compose restart api
   ```

3. **Reset database** (⚠️ loses data):
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### 🌐 Network & Performance Issues

**Issue**: Slow loading or connection problems
```
❌ Pages loading slowly
❌ Timeouts
❌ "Network error" messages
```

**Solutions**:
1. **Check system resources**:
   ```bash
   docker stats
   # Look for high CPU/memory usage
   ```

2. **Restart containers**:
   ```bash
   docker-compose restart
   ```

3. **Check ports**:
   ```bash
   netstat -tulpn | grep -E "(3000|8000|5432)"
   # Should show listening ports
   ```

4. **Free up resources**:
   - Close other applications
   - Clear browser cache
   - Restart Docker if needed

## 🔧 Advanced Troubleshooting

### Debug Mode
```bash
# Enable debug logging
export DEBUG=1
docker-compose up

# Check logs
docker-compose logs -f api
docker-compose logs -f postgres
```

### Database Inspection
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d ai_haccp

# Check tables
\dt

# Check recent temperature logs
SELECT * FROM temperature_logs ORDER BY created_at DESC LIMIT 5;

# Check users
SELECT id, email, name, role FROM users;
```

### Reset Everything
```bash
# Complete reset (⚠️ loses all data)
docker-compose down -v
docker system prune -f
docker-compose up -d
```

## 📞 Getting Help

### Self-Service
1. **Built-in Help**: Visit `/help` page in the platform
2. **AI Assistant**: Ask "help" or "what can you do?"
3. **API Docs**: http://188.165.71.139:8000/docs
4. **Logs**: `docker-compose logs -f`

### Contact Support
- **Email**: support@ai-haccp.com
- **Emergency Food Safety**: 1-800-HACCP-HELP
- **Platform Status**: status.ai-haccp.com

### Before Contacting Support
Please include:
1. **Error message** (exact text)
2. **Steps to reproduce** the issue
3. **Browser/device** information
4. **Docker logs** if applicable:
   ```bash
   docker-compose logs > logs.txt
   ```

## ✅ Prevention Tips

### Daily Maintenance
- Check dashboard for alerts
- Monitor usage costs
- Verify temperature readings
- Test AI assistant periodically

### Weekly Maintenance
- Review cleaning compliance
- Update product information
- Check system performance
- Backup important data

### Monthly Maintenance
- Update browser
- Clear cache and cookies
- Review user access
- Check for platform updates

## 🎯 Quick Fixes Checklist

When something goes wrong, try these in order:

1. ☐ Refresh the browser page
2. ☐ Clear browser cache
3. ☐ Try different browser
4. ☐ Check internet connection
5. ☐ Restart Docker containers
6. ☐ Check system resources
7. ☐ Review error logs
8. ☐ Contact support if needed

Remember: The platform is designed to be reliable and self-healing. Most issues resolve with a simple refresh or restart!