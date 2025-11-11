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
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function AIChat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: t('aiWelcome', language),
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

  // Simple NLP processor for command parsing
  const parseCommand = (input) => {
    const tokens = input.toLowerCase().split(/\s+/);
    const numbers = input.match(/-?\d+\.?\d*/g) || [];
    
    return {
      tokens,
      numbers: numbers.map(n => parseFloat(n)),
      hasTemperature: /temperature|temp|degre|degree|°/.test(input),
      hasAdd: /add|create|new|ajouter/.test(input),
      hasLocation: /fridge|freezer|cooler|kitchen|room|frigo|congélateur/.test(input),
      locations: input.match(/(?:fridge\d*|freezer\d*|cooler\d*|kitchen\d*|room\d*|frigo\d*|congélateur\d*)/gi) || [],
      intent: classifyIntent(input)
    };
  };

  const classifyIntent = (input) => {
    const patterns = {
      temperature: /(?:add|log|record|note|ajouter).*(?:temperature|temp|degre)/i,
      product: /(?:add|create|new|ajouter).*product/i,
      clean: /clean.*room|nettoyer/i,
      status: /status|compliance|how.*doing|statut/i,
      list: /(?:list|show|lister).*products/i,
      cost: /cost|usage|report|coût/i
    };
    
    for (const [intent, pattern] of Object.entries(patterns)) {
      if (pattern.test(input)) return intent;
    }
    return 'unknown';
  };

  const processAICommand = async (userInput) => {
    const parsed = parseCommand(userInput);
    const isFrench = language === 'fr';
    
    // Enhanced temperature logging with NLP
    if (parsed.intent === 'temperature' || parsed.hasTemperature) {
      const temperature = parsed.numbers[0];
      let location = parsed.locations[0] || 'unknown location';
      
      // Extract location from natural language
      const locationPatterns = [
        /(?:of|in|at|for|du|de|dans)\s+([^\s]+(?:\d+)?)/i,
        /(fridge\d*|freezer\d*|cooler\d*|frigo\d*|congélateur\d*)/i
      ];
      
      for (const pattern of locationPatterns) {
        const match = userInput.match(pattern);
        if (match) {
          location = match[1] || match[0];
          break;
        }
      }
      
      if (temperature !== undefined && location !== 'unknown location') {
        try {
          const isWithinLimits = temperature >= -18 && temperature <= 4;
          const result = await api.post('/temperature-logs', {
            location: location.trim(),
            temperature: temperature,
            is_within_limits: isWithinLimits
          });
          
          const status = isWithinLimits ? `✅ ${t('normal', language)}` : `⚠️ ${t('alert', language)}`;
          return isFrench ? 
            `🌡️ Température enregistrée:\n• ${location.trim()}: ${temperature}°C\n• Statut: ${status}` :
            `🌡️ Temperature logged:\n• ${location.trim()}: ${temperature}°C\n• Status: ${status}`;
        } catch (error) {
          return '❌ Failed to log temperature.';
        }
      }
      return isFrench ? 
        'Veuillez spécifier la température et l\'emplacement. Ex: "ajouter température de frigo1 à 10 degrés"' :
        'Please specify temperature and location. Ex: "add temperature of fridge1 to 10 degrees"';
    }

    // Enhanced product management
    if (parsed.intent === 'product') {
      const nameMatch = userInput.match(/(?:add|create|new|ajouter)\s+(?:product\s+)?([^,.\n]+?)(?:\s+with|\s*$)/i);
      if (nameMatch) {
        try {
          const productData = { name: nameMatch[1].trim() };
          const result = await api.post('/products', productData);
          return `✅ Product "${result.name}" added successfully.`;
        } catch (error) {
          return '❌ Failed to add product.';
        }
      }
    }

    // Enhanced room cleaning
    if (parsed.intent === 'clean') {
      const roomMatch = userInput.match(/(?:clean|cleaned|nettoyer)\s+(?:room\s+)?([^,.\n]+?)(?:\s+room|\s*$)/i);
      if (roomMatch) {
        try {
          const result = await api.post('/room-cleaning', {
            room_name: roomMatch[1].trim(),
            cleaning_plan_id: 1,
            notes: 'Cleaned via AI chat'
          });
          return `🧹 Room "${result.room_name}" marked as cleaned.`;
        } catch (error) {
          return '❌ Failed to mark room as cleaned.';
        }
      }
    }

    // Enhanced status checking
    if (parsed.intent === 'status') {
      try {
        const [tempLogs, usageReport] = await Promise.all([
          api.get('/temperature-logs'),
          api.get('/usage-report')
        ]);
        
        const recentAlerts = tempLogs.filter(log => !log.is_within_limits).length;
        const status = recentAlerts === 0 ? '🟢 Compliant' : '🟡 Attention Required';
        
        return `📊 HACCP Status: ${status}\n\n• Alerts: ${recentAlerts}\n• Cost: $${usageReport.monthly_cost.toFixed(4)}\n• Logs: ${tempLogs.length}\n\n${recentAlerts > 0 ? '⚠️ Address alerts' : '✅ All normal'}`;
      } catch (error) {
        return '❌ Failed to get status.';
      }
    }

    // Enhanced product listing
    if (parsed.intent === 'list') {
      try {
        const products = await api.get('/products');
        if (products.length === 0) return 'No products found.';
        
        let response = '📦 Products:\n\n';
        products.slice(0, 10).forEach(product => {
          response += `• ${product.name}`;
          if (product.category) response += ` (${product.category})`;
          if (product.allergens?.length) response += ` ⚠️ ${product.allergens.join(', ')}`;
          response += '\n';
        });
        if (products.length > 10) response += `\n... and ${products.length - 10} more`;
        return response;
      } catch (error) {
        return '❌ Failed to fetch products.';
      }
    }

    // Enhanced usage reporting
    if (parsed.intent === 'cost') {
      try {
        const report = await api.get('/usage-report');
        return `💰 Usage Report:\n\n• Total: $${report.total_cost.toFixed(4)}\n• Monthly: $${report.monthly_cost.toFixed(4)}\n• Savings: ~85%\n\n💡 Serverless efficiency!`;
      } catch (error) {
        return '❌ Failed to get report.';
      }
    }

    // Help and fallback
    if (/help|aide|what.*do/i.test(userInput)) {
      return isFrench ?
        `🤖 Commandes disponibles:\n\n🌡️ "ajouter température de frigo1 à 10 degrés"\n🥘 "ajouter produit saumon frais"\n🧹 "nettoyer cuisine"\n📊 "statut de conformité"\n📦 "lister les produits"\n💰 "rapport d'utilisation"` :
        `🤖 Available commands:\n\n🌡️ "add temperature of fridge1 to 10 degrees"\n🥘 "add product fresh salmon"\n🧹 "clean kitchen room"\n📊 "compliance status"\n📦 "list products"\n💰 "usage report"`;
    }

    // Smart fallback with intent recognition
    const suggestions = {
      temperature: 'Try: "add temperature of [location] to [number] degrees"',
      product: 'Try: "add product [name]"',
      clean: 'Try: "clean [room name]"',
      unknown: 'I can help with temperatures, products, cleaning, and reports. Say "help" for examples.'
    };
    
    return `🤔 ${suggestions[parsed.intent] || suggestions.unknown}`;
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
        {t('aiAssistant', language)}
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
                      label={message.type === 'ai' ? t('aiAssistant', language) : t('you', language)} 
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
              placeholder={t('typeMessage', language)}
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
            {language === 'fr' ? 
              '💡 Essayez: "Enregistrer temp 2.5°C dans congélateur", "Ajouter produit poulet", "Nettoyer cuisine", "Quel est notre statut?"' :
              '💡 Try: "Log temp 2.5°C in freezer", "Add product chicken", "Clean kitchen", "What\'s our status?"'
            }
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}