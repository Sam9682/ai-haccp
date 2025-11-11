# AI-HACCP Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Start the Platform
```bash
cd ai-haccp
docker-compose up -d
```

### 2. Access the Web Interface
- **URL**: http://ai-haccp.swautomorph.com:3000
- **Email**: admin@lebouzou.com
- **Password**: password

### 3. Try These Features

#### 🌡️ Log Your First Temperature
1. Click "Temperature Logs" in sidebar
2. Click "Add Temperature Log"
3. Enter: Location = "Walk-in Cooler", Temperature = 2.5
4. Click "Add Log"
5. ✅ See green checkmark for safe temperature

#### 📦 AI-Powered Material Reception
1. Click "Material Reception" in sidebar
2. Click "Receive Materials"
3. Take photo of delivery box or upload image
4. ✅ AI automatically fills product details
5. Verify information and submit

#### 🤖 Chat with AI Assistant
1. Click "AI Assistant" in sidebar
2. Type: "Receive 2.5kg chicken from supplier 1"
3. Press Enter
4. ✅ AI records material reception

#### 🧹 Interactive Cleaning
1. Click "Cleaning Plan" in sidebar
2. See the demo restaurant layout
3. Click any red room to mark it as cleaned
4. ✅ Room turns green instantly

#### 🥘 Add a Product
1. Go to "Products" page
2. Click "Add Product"
3. Enter: Name = "Fresh Salmon", Allergens = "fish"
4. ✅ Product added to your catalog

### 4. Check Your Status
- Dashboard shows compliance overview
- Usage Report shows costs (typically $0.01-0.05/day)
- All actions are logged for audit trails

## 🎯 What You Just Accomplished

✅ **Temperature Compliance**: Logged safe temperatures  
✅ **AI Integration**: Used natural language commands  
✅ **Material Reception**: AI-powered delivery tracking  
✅ **Cleaning Tracking**: Interactive room management  
✅ **Product Management**: Allergen-aware catalog  
✅ **Cost Monitoring**: Transparent usage tracking  

## 🔥 Power User Tips

### CLI Access
```bash
pip install -r cli_requirements.txt
./cli_client.py login --email admin@lebouzou.com
./cli_client.py log-temp --location "Freezer" --temperature -18
./cli_client.py receive-material --supplier-id 1 --product "Chicken" --quantity 2.5
```

### API Integration
```bash
# Get auth token
TOKEN=$(curl -s -X POST "http://ai-haccp.swautomorph.com:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lebouzou.com","password":"password"}' | jq -r '.access_token')

# Log temperature via API
curl -X POST "http://ai-haccp.swautomorph.com:8000/temperature-logs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location": "Walk-in Cooler", "temperature": 2.5}'
```

### AI Commands to Try
```
"What's our compliance status?"
"Add product chicken breast with no allergens"
"Receive 2.5kg salmon from Fresh Foods supplier"
"Show me the usage report"
"Clean prep area room"
"List all products"
```

## 📱 Mobile Usage

The platform works perfectly on phones and tablets:
- Responsive design adapts to any screen
- Camera integration for material reception
- Touch-optimized buttons and forms
- AI chat works with voice input
- One-handed operation for busy kitchens

## 💰 Cost Transparency

Your usage costs are tracked in real-time:
- **Temperature log**: ~$0.002
- **Product addition**: ~$0.005
- **Material reception**: ~$0.008
- **AI image analysis**: ~$0.015
- **Room cleaning**: ~$0.002
- **AI query**: ~$0.001
- **Typical daily cost**: $0.01-0.05

## 🆘 Need Help?

1. **Built-in Help**: Click "Help & Guide" in the sidebar
2. **AI Assistant**: Ask "help" or "what can you do?"
3. **API Docs**: Visit http://ai-haccp.swautomorph.com:8000/docs
4. **Support**: support@ai-haccp.com

## 🎉 You're Ready!

You now have a complete HACCP compliance system running with:
- Real-time temperature monitoring
- AI-powered material reception with image recognition
- Interactive cleaning management
- Product and allergen tracking
- Natural language AI interface
- Cost-effective serverless architecture
- Complete audit trails for compliance

Start using it daily and watch your food safety compliance become effortless!