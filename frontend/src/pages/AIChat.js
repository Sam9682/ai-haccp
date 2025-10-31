import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon, SmartToy as AIIcon, Person as PersonIcon } from '@mui/icons-material';
import api from '../services/api';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for HACCP management. I can help you with:\n\n• Log temperature readings\n• Add products and suppliers\n• Report incidents\n• Check compliance status\n• Mark rooms as cleaned\n• Get usage reports\n\nWhat would you like to do?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processAICommand = async (userInput) => {
    const input = userInput.toLowerCase();
    
    // Temperature logging
    if (input.includes('temperature') && (input.includes('log') || input.includes('record'))) {
      const tempMatch = input.match(/(-?\d+\.?\d*)\s*(?:degrees?|°|celsius|c)/i);
      const locationMatch = input.match(/(?:in|at|for)\s+([^,.\n]+?)(?:\s+(?:is|was|temperature)|\s*$)/i);
      
      if (tempMatch && locationMatch) {
        try {
          const result = await api.post('/temperature-logs', {
            location: locationMatch[1].trim(),
            temperature: parseFloat(tempMatch[1]),
            is_within_limits: parseFloat(tempMatch[1]) >= -18 && parseFloat(tempMatch[1]) <= 4
          });
          
          const status = result.is_within_limits ? '✅ Normal' : '⚠️ Alert';
          return `Temperature logged successfully:\n• Location: ${result.location}\n• Temperature: ${result.temperature}°C\n• Status: ${status}`;
        } catch (error) {
          return '❌ Failed to log temperature. Please check your input.';
        }
      }
      return 'Please specify both temperature and location. Example: "Log temperature of 3 degrees in walk-in cooler"';
    }

    // Product management
    if (input.includes('add product') || input.includes('new product')) {
      const nameMatch = input.match(/(?:add product|new product)\s+([^,.\n]+?)(?:\s+with|\s*$)/i);
      if (nameMatch) {
        try {
          const allergenMatch = input.match(/allergen[s]?\s*:?\s*([^,.\n]+)/i);
          const categoryMatch = input.match(/category\s*:?\s*([^,.\n]+)/i);
          
          const productData = { name: nameMatch[1].trim() };
          if (allergenMatch) {
            productData.allergens = allergenMatch[1].split(',').map(a => a.trim());
          }
          if (categoryMatch) {
            productData.category = categoryMatch[1].trim();
          }
          
          const result = await api.post('/products', productData);
          return `✅ Product "${result.name}" added successfully to the system.`;
        } catch (error) {
          return '❌ Failed to add product. Please try again.';
        }
      }
      return 'Please specify the product name. Example: "Add product Fresh Salmon with fish allergens"';
    }

    // Room cleaning
    if (input.includes('clean') && input.includes('room')) {
      const roomMatch = input.match(/(?:clean|cleaned)\s+(?:room\s+)?([^,.\n]+?)(?:\s+room|\s*$)/i);
      if (roomMatch) {
        try {
          const result = await api.post('/room-cleaning', {
            room_name: roomMatch[1].trim(),
            cleaning_plan_id: 1, // Default to first plan
            notes: 'Cleaned via AI chat'
          });
          return `✅ Room "${result.room_name}" marked as cleaned successfully.`;
        } catch (error) {
          return '❌ Failed to mark room as cleaned. Please check the room name.';
        }
      }
      return 'Please specify the room name. Example: "Clean kitchen room"';
    }

    // Compliance status
    if (input.includes('status') || input.includes('compliance') || input.includes('how are we doing')) {
      try {
        const [tempLogs, usageReport] = await Promise.all([
          api.get('/temperature-logs'),
          api.get('/usage-report')
        ]);
        
        const recentAlerts = tempLogs.filter(log => !log.is_within_limits).length;
        const status = recentAlerts === 0 ? '🟢 Compliant' : '🟡 Attention Required';
        
        return `HACCP Compliance Status: ${status}\n\n• Temperature Alerts: ${recentAlerts}\n• Monthly Cost: $${usageReport.monthly_cost.toFixed(4)}\n• Recent Logs: ${tempLogs.length}\n\n${recentAlerts > 0 ? '⚠️ Please address temperature alerts' : '✅ All systems normal'}`;
      } catch (error) {
        return '❌ Failed to get compliance status.';
      }
    }

    // List products
    if (input.includes('list products') || input.includes('show products') || input.includes('what products')) {
      try {
        const products = await api.get('/products');
        if (products.length === 0) {
          return 'No products found in the system.';
        }
        
        let response = 'Products in System:\n\n';
        products.forEach(product => {
          response += `• ${product.name}`;
          if (product.category) response += ` (${product.category})`;
          if (product.allergens && product.allergens.length > 0) {
            response += ` - Allergens: ${product.allergens.join(', ')}`;
          }
          response += '\n';
        });
        return response;
      } catch (error) {
        return '❌ Failed to fetch products.';
      }
    }

    // Usage report
    if (input.includes('cost') || input.includes('usage') || input.includes('report')) {
      try {
        const report = await api.get('/usage-report');
        return `Platform Usage Report:\n\n• Total Cost: $${report.total_cost.toFixed(4)}\n• Monthly Cost: $${report.monthly_cost.toFixed(4)}\n• Serverless Savings: ~85% vs traditional hosting\n\n💡 Pay-per-use model keeps costs low!`;
      } catch (error) {
        return '❌ Failed to get usage report.';
      }
    }

    // Help
    if (input.includes('help') || input.includes('what can you do')) {
      return `I can help you with these HACCP tasks:\n\n🌡️ **Temperature Logging**\n"Log temperature of 3 degrees in walk-in cooler"\n\n🥘 **Product Management**\n"Add product Fresh Tuna with fish allergens"\n"List all products"\n\n🧹 **Cleaning Management**\n"Clean kitchen room"\n"Mark prep area as cleaned"\n\n📊 **Status & Reports**\n"What's our compliance status?"\n"Show usage report"\n\n❗ **Incident Reporting**\n"Report temperature incident in freezer"\n\nJust tell me what you need in natural language!`;
    }

    return `I understand you want to: "${userInput}"\n\nI can help with temperature logging, product management, room cleaning, and status reports. Could you be more specific? Type "help" for examples.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await processAICommand(input);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ alignItems: 'flex-start', mb: 1 }}>
                <Avatar sx={{ mr: 2, mt: 0.5 }}>
                  {message.type === 'ai' ? <AIIcon /> : <PersonIcon />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Chip 
                      label={message.type === 'ai' ? 'AI Assistant' : 'You'} 
                      size="small" 
                      color={message.type === 'ai' ? 'primary' : 'default'}
                    />
                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      backgroundColor: message.type === 'ai' ? '#f5f5f5' : '#e3f2fd',
                      p: 1.5,
                      borderRadius: 1
                    }}
                  >
                    {message.content}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            {loading && (
              <ListItem sx={{ justifyContent: 'center' }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  AI is thinking...
                </Typography>
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </Box>
        
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Ask me anything about HACCP... (e.g., 'Log temperature of 3 degrees in walk-in cooler')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            💡 Try: "Log temp 2.5°C in freezer", "Add product chicken", "Clean kitchen", "What's our status?"
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}