import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Thermostat as TempIcon,
  Inventory as ProductIcon,
  CleaningServices as CleanIcon,
  SmartToy as AIIcon,
  Assessment as ReportIcon,
  LocalShipping as ReceptionIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function Help() {
  const [expanded, setExpanded] = useState('getting-started');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const quickCommands = [
    { command: 'Log temperature of 3 degrees in walk-in cooler', description: 'Records temperature reading' },
    { command: 'Add product Fresh Salmon with fish allergens', description: 'Adds new product with allergen info' },
    { command: 'Receive 2.5kg chicken breast from supplier 1', description: 'Records material reception' },
    { command: 'Clean kitchen room', description: 'Marks room as cleaned' },
    { command: 'What\'s our compliance status?', description: 'Shows current HACCP compliance' },
    { command: 'Show usage report', description: 'Displays cost and usage analytics' },
    { command: 'List all products', description: 'Shows all products in system' }
  ];

  const temperatureRanges = [
    { item: 'Refrigerated Foods', range: '0°C to 4°C', status: 'safe' },
    { item: 'Frozen Foods', range: '-18°C to -15°C', status: 'safe' },
    { item: 'Hot Holding', range: 'Above 60°C', status: 'safe' },
    { item: 'Danger Zone', range: '4°C to 60°C', status: 'danger' }
  ];

  const workflows = [
    {
      title: 'Morning Routine',
      steps: [
        'Check Dashboard for overnight alerts',
        'Log all equipment temperatures',
        'Review cleaning status',
        'Ask AI: "What\'s our compliance status?"'
      ]
    },
    {
      title: 'During Service',
      steps: [
        'Quick temperature spot checks',
        'Click rooms as they\'re cleaned',
        'Log new product deliveries',
        'Use voice commands for hands-free operation'
      ]
    },
    {
      title: 'End of Day',
      steps: [
        'Record final temperatures',
        'Mark all cleaned areas',
        'Review daily compliance summary',
        'Plan for tomorrow\'s tasks'
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Help & User Guide
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Welcome to AI-HACCP! This guide will help you master food safety management with our platform.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Accordion expanded={expanded === 'getting-started'} onChange={handleChange('getting-started')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">🚀 Getting Started</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Demo Login Credentials:</strong>
              </Typography>
              <Card sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography>Email: admin@restaurant.com</Typography>
                  <Typography>Password: password</Typography>
                </CardContent>
              </Card>
              <Typography paragraph>
                After login, you'll see the main dashboard with temperature logs, products, incidents, and monthly costs.
                Navigate using the sidebar menu to access different features.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'temperature'} onChange={handleChange('temperature')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6"><TempIcon sx={{ mr: 1 }} />Temperature Monitoring</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Track and log temperatures for food safety compliance:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Navigate to 'Temperature Logs'" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Click 'Add Temperature Log'" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Enter location, temperature, and optional equipment ID" />
                </ListItem>
              </List>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Safe Temperature Ranges</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Food Type</TableCell>
                      <TableCell>Safe Range</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {temperatureRanges.map((range, index) => (
                      <TableRow key={index}>
                        <TableCell>{range.item}</TableCell>
                        <TableCell>{range.range}</TableCell>
                        <TableCell>
                          <Chip 
                            label={range.status === 'safe' ? 'Safe' : 'Danger'} 
                            color={range.status === 'safe' ? 'success' : 'error'} 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'products'} onChange={handleChange('products')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6"><ProductIcon sx={{ mr: 1 }} />Product Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Maintain a complete catalog of food products with allergen tracking:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Go to 'Products' page" 
                    secondary="View all current products in your system"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Click 'Add Product'" 
                    secondary="Opens the product creation form"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Fill in product details" 
                    secondary="Name (required), category, allergens, shelf life, storage temps"
                  />
                </ListItem>
              </List>
              
              <Alert severity="tip" sx={{ mt: 2 }}>
                <strong>Tip:</strong> Use comma-separated allergens like "milk, eggs, nuts" for proper tracking.
              </Alert>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'cleaning'} onChange={handleChange('cleaning')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6"><CleanIcon sx={{ mr: 1 }} />Cleaning Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Create visual cleaning plans and track room cleaning activities:
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Creating a Cleaning Plan:</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Navigate to 'Cleaning Plan'" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Click 'Create Plan'" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Fill in plan details (name, frequency, duration)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Draw rooms by clicking and dragging on canvas" />
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Using Interactive Cleaning:</Typography>
              <Card sx={{ mt: 2, bgcolor: '#e8f5e8' }}>
                <CardContent>
                  <Typography><strong>Green rooms:</strong> Recently cleaned (&lt; 24 hours)</Typography>
                  <Typography><strong>Red rooms:</strong> Need attention (&gt; 24 hours)</Typography>
                  <Typography sx={{ mt: 1 }}><strong>Click any red room</strong> to mark it as cleaned!</Typography>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'material-reception'} onChange={handleChange('material-reception')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6"><ReceptionIcon sx={{ mr: 1 }} />Material Reception</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                AI-powered material reception with barcode scanning and image recognition:
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 1 }}>Using AI Recognition:</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Take photo of delivery box or upload image" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="AI automatically extracts product information" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Verify and adjust AI-filled form fields" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Complete with supplier, temperature, and quality notes" />
                </ListItem>
              </List>

              <Alert severity="success" sx={{ mt: 2 }}>
                <strong>AI Features:</strong> Barcode recognition, product identification, category detection, expiry date parsing, and quality assessment from photos.
              </Alert>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'ai-chat'} onChange={handleChange('ai-chat')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6"><AIIcon sx={{ mr: 1 }} />AI Assistant</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Use natural language to interact with the platform:
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 1 }}>Quick Commands:</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Command</TableCell>
                      <TableCell>What it does</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quickCommands.map((cmd, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          "{cmd.command}"
                        </TableCell>
                        <TableCell>{cmd.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Pro Tip:</strong> The AI understands natural language! Just describe what you want to do.
              </Alert>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'workflows'} onChange={handleChange('workflows')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📋 Daily Workflows</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {workflows.map((workflow, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{workflow.title}</Typography>
                        <List dense>
                          {workflow.steps.map((step, stepIndex) => (
                            <ListItem key={stepIndex}>
                              <ListItemIcon>
                                <CheckIcon color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={step} 
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'troubleshooting'} onChange={handleChange('troubleshooting')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">🔧 Troubleshooting</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>Common Issues:</Typography>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Login Problems
                  </Typography>
                  <List dense>
                    <ListItem><ListItemText primary="Check email/password spelling" /></ListItem>
                    <ListItem><ListItemText primary="Ensure caps lock is off" /></ListItem>
                    <ListItem><ListItemText primary="Try refreshing the page" /></ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Temperature Alerts
                  </Typography>
                  <List dense>
                    <ListItem><ListItemText primary="Red temperatures indicate safety issues" /></ListItem>
                    <ListItem><ListItemText primary="Check equipment immediately" /></ListItem>
                    <ListItem><ListItemText primary="Document corrective actions" /></ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    AI Chat Not Understanding
                  </Typography>
                  <List dense>
                    <ListItem><ListItemText primary='Use specific terms: "log temperature", "add product"' /></ListItem>
                    <ListItem><ListItemText primary='Include numbers: "3 degrees in walk-in cooler"' /></ListItem>
                    <ListItem><ListItemText primary='Type "help" for command examples' /></ListItem>
                  </List>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ReportIcon sx={{ mr: 1 }} />Quick Reference
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Safe Temperatures:</strong><br />
                🧊 Freezer: -18°C to -15°C<br />
                ❄️ Fridge: 0°C to 4°C<br />
                🔥 Hot: Above 60°C
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Room Status:</strong><br />
                🟢 Green = Recently cleaned<br />
                🔴 Red = Needs attention
              </Typography>
              <Typography variant="body2">
                <strong>AI Commands:</strong><br />
                Just talk naturally!<br />
                "Log temp", "Add product", "Clean room"
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>💰 Cost Information</Typography>
              <Typography variant="body2" paragraph>
                <strong>Serverless Benefits:</strong><br />
                • Pay only for actual usage<br />
                • 85% savings vs traditional hosting<br />
                • Automatic scaling<br />
                • No maintenance costs
              </Typography>
              <Typography variant="body2">
                <strong>Typical Monthly Costs:</strong><br />
                Small restaurant: $5-15<br />
                Medium restaurant: $15-50<br />
                Large restaurant: $50-150
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📞 Need More Help?</Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mb: 1 }}
                onClick={() => window.open('mailto:support@ai-haccp.com')}
              >
                Email Support
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mb: 1 }}
                onClick={() => window.open('/ai-chat', '_blank')}
              >
                Ask AI Assistant
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Emergency:</strong><br />
                Food Safety Hotline:<br />
                1-800-HACCP-HELP
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}