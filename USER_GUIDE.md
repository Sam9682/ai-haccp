# AI-HACCP Platform User Guide

## 🏥 Welcome to AI-HACCP

AI-HACCP is a comprehensive Food Safety Management Platform designed specifically for restaurants. It simplifies HACCP compliance while providing cost-effective, serverless architecture.

## 🚀 Quick Start Guide

### 1. First Login
- **URL**: http://ai-haccp.swautomorph.com:3000
- **Demo Credentials**:
  - Email: `admin@lebouzou.com`
  - Password: `password`

### 2. Dashboard Overview
After login, you'll see the main dashboard with:
- **Temperature Logs**: Current count and recent readings
- **Products**: Number of products in your system
- **Open Incidents**: Any food safety issues requiring attention
- **Monthly Cost**: Your current usage costs

## 📊 Core Features

### 🌡️ Temperature Monitoring

**Purpose**: Track and log temperatures for food safety compliance

**How to Use**:
1. Navigate to "Temperature Logs"
2. Click "Add Temperature Log"
3. Fill in:
   - **Location**: Where you measured (e.g., "Walk-in Cooler")
   - **Temperature**: Reading in Celsius
   - **Equipment ID**: Optional equipment identifier
4. Click "Add Log"

**Safe Ranges**:
- **Refrigerated items**: 0°C to 4°C
- **Frozen items**: -18°C to -15°C
- **Hot holding**: Above 60°C

**Visual Indicators**:
- ✅ **Green**: Temperature within safe limits
- ⚠️ **Red**: Temperature outside safe limits (requires action)

### 🥘 Product Management

**Purpose**: Maintain a catalog of all food products with allergen tracking

**How to Use**:
1. Go to "Products" page
2. Click "Add Product"
3. Enter product details:
   - **Name**: Product name (required)
   - **Category**: Food category (optional)
   - **Allergens**: Comma-separated list (e.g., "milk, eggs, nuts")
   - **Shelf Life**: Days until expiration
   - **Storage Temperature**: Min/max safe storage temps
4. Click "Add Product"

**Benefits**:
- Complete ingredient tracking
- Allergen management for customer safety
- Storage requirement documentation
- Compliance audit trail

### 🧹 Cleaning Management

**Purpose**: Create visual cleaning plans and track room cleaning activities

**How to Use**:

#### Creating a Cleaning Plan:
1. Navigate to "Cleaning Plan"
2. Click "Create Plan"
3. Fill in plan details:
   - **Name**: Plan name (e.g., "Daily Kitchen Cleaning")
   - **Frequency**: Daily, Weekly, or Monthly
   - **Description**: Optional details
   - **Duration**: Estimated time in minutes
4. **Draw Rooms**: Click and drag on the canvas to create room rectangles
5. **Name Rooms**: Enter room names when prompted
6. Click "Create Plan"

#### Using Interactive Cleaning:
1. Select a cleaning plan from the sidebar
2. View the restaurant layout with color-coded rooms:
   - **Green rooms**: Recently cleaned (< 24 hours)
   - **Red rooms**: Need attention (> 24 hours)
3. **Click any red room** to mark it as cleaned
4. Room instantly turns green and cleaning is recorded

**Benefits**:
- Visual restaurant layout
- One-click cleaning tracking
- Automatic compliance monitoring
- Complete cleaning audit trail

### 🤖 AI Assistant

**Purpose**: Natural language interface for hands-free HACCP management

**How to Use**:
1. Navigate to "AI Assistant"
2. Type natural language commands in the chat box
3. Press Enter or click Send

**Example Commands**:
```
"Log temperature of 3 degrees in walk-in cooler"
"Add product Fresh Salmon with fish allergens"
"Receive 2.5kg chicken breast from Fresh Foods supplier"
"Clean kitchen room"
"What's our compliance status?"
"Show usage report"
"List all products"
"How are we doing with food safety?"
```

**Benefits**:
- No technical training required
- Voice-like interaction
- Instant responses
- Context-aware conversations
- Perfect for busy kitchen environments

### 📦 Material Reception

**Purpose**: AI-powered material reception with barcode scanning and image recognition

**How to Use**:
1. Navigate to "Material Reception"
2. Click "Receive Materials"
3. **Take Photo or Upload Image**: Use camera or file upload
4. **AI Analysis**: System automatically extracts product information
5. **Verify Details**: Check and adjust AI-filled information
6. **Complete Reception**: Add supplier, quantities, temperatures

**AI Features**:
- **Image Recognition**: Automatically identifies products from photos
- **Barcode Scanning**: OCR barcode recognition and lookup
- **Auto-Fill Forms**: AI populates product details automatically
- **Category Detection**: Smart food category classification
- **Date Parsing**: Extracts expiry dates in multiple formats
- **Quality Assessment**: Visual documentation of deliveries

**Benefits**:
- Complete traceability from supplier to customer
- Reduced manual data entry errors
- Visual evidence for quality control
- Automatic HACCP compliance tracking
- Mobile-optimized for receiving dock use

### 📈 Usage Reports

**Purpose**: Monitor platform costs and usage analytics

**What You'll See**:
- **Total Cost**: All-time platform usage cost
- **Monthly Cost**: Current month expenses
- **Cost per User**: Estimated individual usage
- **Serverless Savings**: 85% savings vs traditional hosting
- **Usage Breakdown**: Costs by activity type
- **Optimization Tips**: AI-powered cost reduction suggestions

## 🎯 Daily Workflows

### Morning Routine
1. **Check Dashboard**: Review overnight alerts
2. **Log Temperatures**: Record all equipment temperatures
3. **Review Cleaning Status**: Check which rooms need attention
4. **Ask AI**: "What's our compliance status?"

### During Service
1. **Quick Temperature Checks**: Use mobile interface for spot checks
2. **Clean Rooms**: Click rooms as they're cleaned
3. **Receive Materials**: Use AI-powered reception for deliveries
4. **Voice Commands**: Use AI for hands-free logging

### End of Day
1. **Final Temperature Logs**: Record closing temperatures
2. **Complete Cleaning**: Mark all cleaned areas
3. **Review Reports**: Check daily compliance summary
4. **Plan Tomorrow**: Review any pending issues

## 📱 Mobile Usage

### Responsive Design
- All features work on smartphones and tablets
- Touch-optimized interface
- Swipe navigation
- Large buttons for easy tapping

### Mobile-Specific Tips
- **Portrait Mode**: Best for forms and lists
- **Landscape Mode**: Better for cleaning plans and charts
- **Voice Input**: Use device voice input with AI chat
- **Offline Capability**: Basic functions work without internet

## 🔧 Advanced Features

### API Integration
Connect existing restaurant systems:
```bash
# Example: Log temperature via API
curl -X POST "http://ai-haccp.swautomorph.com:8000/temperature-logs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location": "Walk-in Cooler", "temperature": 2.5}'
```

### Command Line Interface
For power users and automation:
```bash
# Install CLI tools
pip install -r cli_requirements.txt

# Login
./cli_client.py login --email admin@lebouzou.com

# Log temperature
./cli_client.py log-temp --location "Freezer" --temperature -18
```

### MCP Integration
Connect with AI assistants like Claude:
```json
{
  "mcpServers": {
    "ai-haccp": {
      "command": "python",
      "args": ["mcp_server.py"]
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**Login Problems**:
- Check email/password spelling
- Ensure caps lock is off
- Try refreshing the page
- Contact admin if account is locked

**Temperature Alerts**:
- Red temperatures indicate safety issues
- Check equipment immediately
- Document corrective actions
- Report persistent issues

**Cleaning Plan Issues**:
- Ensure rooms are drawn large enough (minimum 20x20 pixels)
- Room names must be unique within a plan
- Click precisely within room boundaries
- Refresh page if canvas doesn't respond

**AI Chat Not Understanding**:
- Use specific terms: "log temperature", "add product", "clean room"
- Include numbers and locations: "3 degrees in walk-in cooler"
- Try rephrasing: "Mark kitchen as cleaned" vs "Clean kitchen"
- Type "help" for command examples

### Performance Tips

**Faster Loading**:
- Close unused browser tabs
- Clear browser cache monthly
- Use Chrome or Firefox for best performance
- Ensure stable internet connection

**Mobile Optimization**:
- Use WiFi when possible
- Close other apps while using platform
- Update browser regularly
- Enable JavaScript

## 💰 Cost Management

### Understanding Costs
- **Per-Use Pricing**: Only pay for actual operations
- **Shared Infrastructure**: Costs split among all users
- **Transparent Billing**: See exactly what you're paying for
- **No Hidden Fees**: All costs clearly displayed

### Cost Optimization Tips
1. **Batch Operations**: Log multiple temperatures at once
2. **Use AI Efficiently**: Ask specific questions
3. **Regular Cleanup**: Archive old data periodically
4. **Monitor Usage**: Check reports weekly
5. **Train Staff**: Efficient usage reduces costs

### Typical Monthly Costs
- **Small Restaurant** (1-5 users): $5-15/month
- **Medium Restaurant** (6-20 users): $15-50/month
- **Large Restaurant** (20+ users): $50-150/month
- **Chain Operations**: Volume discounts available

## 🔐 Security & Compliance

### Data Protection
- All data encrypted in transit and at rest
- Regular security updates
- Compliance with food safety regulations
- Audit trails for all actions

### User Management
- Role-based access control
- Individual user tracking
- Session timeout for security
- Password requirements

### Backup & Recovery
- Automatic daily backups
- 99.9% uptime guarantee
- Disaster recovery procedures
- Data export capabilities

## 📞 Support & Resources

### Getting Help
1. **Built-in Help**: Click help icons throughout the platform
2. **AI Assistant**: Ask "help" or "what can you do?"
3. **Documentation**: Visit /help page in the platform
4. **Email Support**: support@ai-haccp.com

### Training Resources
- **Video Tutorials**: Available in help section
- **Webinar Training**: Monthly group sessions
- **One-on-one Training**: Available for new users
- **Best Practices Guide**: Industry-specific tips

### Community
- **User Forum**: Share tips and ask questions
- **Feature Requests**: Suggest improvements
- **Beta Testing**: Try new features early
- **Success Stories**: Learn from other restaurants

## 🎓 Best Practices

### Temperature Monitoring
- Log temperatures at consistent times
- Use multiple locations for large areas
- Calibrate thermometers monthly
- Document corrective actions immediately

### Product Management
- Update products when menu changes
- Include all allergen information
- Set realistic shelf life dates
- Review product list quarterly

### Cleaning Management
- Create detailed room layouts
- Update plans when layout changes
- Train all staff on cleaning procedures
- Review cleaning logs weekly

### AI Usage
- Use natural, conversational language
- Be specific with locations and numbers
- Ask follow-up questions for clarification
- Use voice input for hands-free operation

## 🔄 Updates & Maintenance

### Automatic Updates
- Platform updates automatically
- No downtime for updates
- New features added regularly
- Security patches applied immediately

### Maintenance Schedule
- **Daily**: Automatic backups
- **Weekly**: Performance optimization
- **Monthly**: Security reviews
- **Quarterly**: Feature updates

### Staying Current
- Check dashboard for update notifications
- Read monthly newsletter for new features
- Attend webinars for advanced tips
- Follow best practices updates

---

## 📋 Quick Reference Card

### Essential Commands
| Action | Web Interface | AI Chat | CLI |
|--------|---------------|---------|-----|
| Log Temperature | Temperature Logs → Add | "Log temp 3°C in cooler" | `log-temp --location "Cooler" --temperature 3` |
| Add Product | Products → Add Product | "Add product Salmon with fish allergens" | `add-product --name "Salmon" --allergens "fish"` |
| Clean Room | Cleaning Plan → Click Room | "Clean kitchen room" | `clean-room --room "Kitchen" --plan-id 1` |
| Check Status | Dashboard | "What's our status?" | `status` |

### Emergency Contacts
- **Technical Support**: support@ai-haccp.com
- **Food Safety Hotline**: 0033619899050
- **Platform Status**: status.ai-haccp.com

### Remember
- 🌡️ Safe temps: 0-4°C (fridge), -18 to -15°C (freezer)
- 🧹 Clean rooms turn green when clicked
- 🤖 AI understands natural language
- 💰 Pay only for what you use
- 📱 Works on all devices