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
  ListItemText,

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
  Info as InfoIcon,

} from '@mui/icons-material';

export default function Help() {
  const [expanded, setExpanded] = useState('getting-started');
  const language = localStorage.getItem('language') || 'en';

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const t = {
    en: {
      title: 'Help & User Guide',
      welcome: 'Welcome to AI-HACCP! This guide will help you master food safety management with our platform.',
      gettingStarted: '🚀 Getting Started',
      demoCredentials: 'Demo Login Credentials:',
      afterLogin: "After login, you'll see the main dashboard with temperature logs, products, incidents, and monthly costs. Navigate using the sidebar menu to access different features.",
      temperatureMonitoring: 'Temperature Monitoring',
      trackTemperatures: 'Track and log temperatures for food safety compliance:',
      navigateToTemp: "Navigate to 'Temperature Logs'",
      clickAddTemp: "Click 'Add Temperature Log'",
      enterDetails: 'Enter location, temperature, and optional equipment ID',
      safeRanges: 'Safe Temperature Ranges',
      foodType: 'Food Type',
      safeRange: 'Safe Range',
      status: 'Status',
      refrigeratedFoods: 'Refrigerated Foods',
      frozenFoods: 'Frozen Foods',
      hotHolding: 'Hot Holding',
      dangerZone: 'Danger Zone',
      safe: 'Safe',
      danger: 'Danger',
      productManagement: 'Product Management',
      maintainCatalog: 'Maintain a complete catalog of food products with allergen tracking:',
      goToProducts: "Go to 'Products' page",
      viewProducts: 'View all current products in your system',
      clickAddProduct: "Click 'Add Product'",
      opensForm: 'Opens the product creation form',
      fillDetails: 'Fill in product details',
      productDetailsDesc: 'Name (required), category, allergens, shelf life, storage temps',
      tip: 'Tip:',
      allergenTip: 'Use comma-separated allergens like "milk, eggs, nuts" for proper tracking.',
      cleaningManagement: 'Cleaning Management',
      createVisual: 'Create visual cleaning plans and track room cleaning activities:',
      creatingPlan: 'Creating a Cleaning Plan:',
      navigateClean: "Navigate to 'Cleaning Plan'",
      clickCreate: "Click 'Create Plan'",
      fillPlanDetails: 'Fill in plan details (name, frequency, duration)',
      drawRooms: 'Draw rooms by clicking and dragging on canvas',
      interactiveCleaning: 'Using Interactive Cleaning:',
      greenRooms: 'Green rooms: Recently cleaned (< 24 hours)',
      redRooms: 'Red rooms: Need attention (> 24 hours)',
      clickRed: 'Click any red room to mark it as cleaned!',
      materialReception: 'Material Reception',
      aiPowered: 'AI-powered material reception with barcode scanning and image recognition:',
      usingAI: 'Using AI Recognition:',
      takePhoto: 'Take photo of delivery box or upload image',
      aiExtracts: 'AI automatically extracts product information',
      verifyAdjust: 'Verify and adjust AI-filled form fields',
      completeWith: 'Complete with supplier, temperature, and quality notes',
      aiFeatures: 'Barcode recognition, product identification, category detection, expiry date parsing, and quality assessment from photos.',
      aiAssistant: 'AI Assistant',
      naturalLanguage: 'Use natural language to interact with the platform:',
      quickCommands: 'Quick Commands:',
      command: 'Command',
      whatItDoes: 'What it does',
      proTip: 'Pro Tip: The AI understands natural language! Just describe what you want to do.',
      dailyWorkflows: '📋 Daily Workflows',
      morningRoutine: 'Morning Routine',
      duringService: 'During Service',
      endOfDay: 'End of Day',
      troubleshooting: '🔧 Troubleshooting',
      commonIssues: 'Common Issues:',
      loginProblems: 'Login Problems',
      temperatureAlerts: 'Temperature Alerts',
      aiNotUnderstanding: 'AI Chat Not Understanding',
      quickReference: 'Quick Reference',
      safeTemperatures: 'Safe Temperatures:',
      roomStatus: 'Room Status:',
      aiCommands: 'AI Commands:',
      justTalk: 'Just talk naturally!',
      costInfo: '💰 Cost Information',
      serverlessBenefits: 'Serverless Benefits:',
      payUsage: '• Pay only for actual usage',
      savings: '• 85% savings vs traditional hosting',
      autoScaling: '• Automatic scaling',
      noMaintenance: '• No maintenance costs',
      typicalCosts: 'Typical Monthly Costs:',
      smallRestaurant: 'Small restaurant: $5-15',
      mediumRestaurant: 'Medium restaurant: $15-50',
      largeRestaurant: 'Large restaurant: $50-150',
      needHelp: '📞 Need More Help?',
      emailSupport: 'Email Support',
      askAI: 'Ask AI Assistant',
      emergency: 'Emergency:',
      foodSafetyHotline: 'Food Safety Hotline:'
    },
    fr: {
      title: 'Aide et Guide Utilisateur',
      welcome: 'Bienvenue sur AI-HACCP ! Ce guide vous aidera à maîtriser la gestion de la sécurité alimentaire avec notre plateforme.',
      gettingStarted: '🚀 Commencer',
      demoCredentials: 'Identifiants de démonstration :',
      afterLogin: "Après connexion, vous verrez le tableau de bord principal avec les journaux de température, produits, incidents et coûts mensuels. Naviguez avec le menu latéral pour accéder aux différentes fonctionnalités.",
      temperatureMonitoring: 'Surveillance de la Température',
      trackTemperatures: 'Suivez et enregistrez les températures pour la conformité de sécurité alimentaire :',
      navigateToTemp: "Naviguez vers 'Journaux de Température'",
      clickAddTemp: "Cliquez sur 'Ajouter Journal de Température'",
      enterDetails: 'Entrez l\'emplacement, la température et l\'ID d\'équipement optionnel',
      safeRanges: 'Plages de Température Sûres',
      foodType: 'Type d\'Aliment',
      safeRange: 'Plage Sûre',
      status: 'Statut',
      refrigeratedFoods: 'Aliments Réfrigérés',
      frozenFoods: 'Aliments Congelés',
      hotHolding: 'Maintien au Chaud',
      dangerZone: 'Zone de Danger',
      safe: 'Sûr',
      danger: 'Danger',
      productManagement: 'Gestion des Produits',
      maintainCatalog: 'Maintenez un catalogue complet de produits alimentaires avec suivi des allergènes :',
      goToProducts: "Allez à la page 'Produits'",
      viewProducts: 'Voir tous les produits actuels dans votre système',
      clickAddProduct: "Cliquez sur 'Ajouter Produit'",
      opensForm: 'Ouvre le formulaire de création de produit',
      fillDetails: 'Remplissez les détails du produit',
      productDetailsDesc: 'Nom (requis), catégorie, allergènes, durée de conservation, températures de stockage',
      tip: 'Conseil :',
      allergenTip: 'Utilisez des allergènes séparés par des virgules comme "lait, œufs, noix" pour un suivi approprié.',
      cleaningManagement: 'Gestion du Nettoyage',
      createVisual: 'Créez des plans de nettoyage visuels et suivez les activités de nettoyage des salles :',
      creatingPlan: 'Création d\'un Plan de Nettoyage :',
      navigateClean: "Naviguez vers 'Plan de Nettoyage'",
      clickCreate: "Cliquez sur 'Créer un Plan'",
      fillPlanDetails: 'Remplissez les détails du plan (nom, fréquence, durée)',
      drawRooms: 'Dessinez les salles en cliquant et glissant sur le canevas',
      interactiveCleaning: 'Utilisation du Nettoyage Interactif :',
      greenRooms: 'Salles vertes : Récemment nettoyées (< 24 heures)',
      redRooms: 'Salles rouges : Nécessitent attention (> 24 heures)',
      clickRed: 'Cliquez sur n\'importe quelle salle rouge pour la marquer comme nettoyée !',
      materialReception: 'Réception de Matériel',
      aiPowered: 'Réception de matériel alimentée par IA avec scan de codes-barres et reconnaissance d\'images :',
      usingAI: 'Utilisation de la Reconnaissance IA :',
      takePhoto: 'Prenez une photo de la boîte de livraison ou téléchargez une image',
      aiExtracts: 'L\'IA extrait automatiquement les informations du produit',
      verifyAdjust: 'Vérifiez et ajustez les champs de formulaire remplis par l\'IA',
      completeWith: 'Complétez avec le fournisseur, la température et les notes de qualité',
      aiFeatures: 'Reconnaissance de codes-barres, identification de produits, détection de catégories, analyse de dates d\'expiration et évaluation de qualité à partir de photos.',
      aiAssistant: 'Assistant IA',
      naturalLanguage: 'Utilisez le langage naturel pour interagir avec la plateforme :',
      quickCommands: 'Commandes Rapides :',
      command: 'Commande',
      whatItDoes: 'Ce que ça fait',
      proTip: 'Conseil Pro : L\'IA comprend le langage naturel ! Décrivez simplement ce que vous voulez faire.',
      dailyWorkflows: '📋 Flux de Travail Quotidiens',
      morningRoutine: 'Routine Matinale',
      duringService: 'Pendant le Service',
      endOfDay: 'Fin de Journée',
      troubleshooting: '🔧 Dépannage',
      commonIssues: 'Problèmes Courants :',
      loginProblems: 'Problèmes de Connexion',
      temperatureAlerts: 'Alertes de Température',
      aiNotUnderstanding: 'IA Chat Ne Comprend Pas',
      quickReference: 'Référence Rapide',
      safeTemperatures: 'Températures Sûres :',
      roomStatus: 'Statut des Salles :',
      aiCommands: 'Commandes IA :',
      justTalk: 'Parlez naturellement !',
      costInfo: '💰 Informations sur les Coûts',
      serverlessBenefits: 'Avantages Sans Serveur :',
      payUsage: '• Payez seulement pour l\'utilisation réelle',
      savings: '• 85% d\'économies vs hébergement traditionnel',
      autoScaling: '• Mise à l\'échelle automatique',
      noMaintenance: '• Aucun coût de maintenance',
      typicalCosts: 'Coûts Mensuels Typiques :',
      smallRestaurant: 'Petit restaurant : 5-15€',
      mediumRestaurant: 'Restaurant moyen : 15-50€',
      largeRestaurant: 'Grand restaurant : 50-150€',
      needHelp: '📞 Besoin d\'Aide ?',
      emailSupport: 'Support Email',
      askAI: 'Demander à l\'Assistant IA',
      emergency: 'Urgence :',
      foodSafetyHotline: 'Ligne d\'Urgence Sécurité Alimentaire :'
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        {t[language].title}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        {t[language].welcome}
      </Alert>

      {/* Getting Started */}
      <Accordion expanded={expanded === 'getting-started'} onChange={handleChange('getting-started')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{t[language].gettingStarted}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t[language].demoCredentials}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Email:</strong> admin@lebouzou.com<br />
                    <strong>Password:</strong> password
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                {t[language].afterLogin}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Temperature Monitoring */}
      <Accordion expanded={expanded === 'temperature'} onChange={handleChange('temperature')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TempIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{t[language].temperatureMonitoring}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {t[language].trackTemperatures}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t[language].navigateToTemp} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t[language].clickAddTemp} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t[language].enterDetails} />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            {t[language].safeRanges}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t[language].foodType}</TableCell>
                  <TableCell>{t[language].safeRange}</TableCell>
                  <TableCell>{t[language].status}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{t[language].refrigeratedFoods}</TableCell>
                  <TableCell>0°C to 4°C</TableCell>
                  <TableCell><Chip label={t[language].safe} color="success" size="small" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t[language].frozenFoods}</TableCell>
                  <TableCell>-18°C or below</TableCell>
                  <TableCell><Chip label={t[language].safe} color="success" size="small" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t[language].hotHolding}</TableCell>
                  <TableCell>60°C or above</TableCell>
                  <TableCell><Chip label={t[language].safe} color="success" size="small" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t[language].dangerZone}</TableCell>
                  <TableCell>4°C to 60°C</TableCell>
                  <TableCell><Chip label={t[language].danger} color="error" size="small" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Product Management */}
      <Accordion expanded={expanded === 'products'} onChange={handleChange('products')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ProductIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{t[language].productManagement}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {t[language].maintainCatalog}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText primary={t[language].goToProducts} />
            </ListItem>
            <ListItem>
              <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
              <ListItemText primary={t[language].viewProducts} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary={t[language].clickAddProduct}
                secondary={t[language].opensForm}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary={t[language].fillDetails}
                secondary={t[language].productDetailsDesc}
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>{t[language].tip}</strong> {t[language].allergenTip}
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* AI Assistant */}
      <Accordion expanded={expanded === 'ai'} onChange={handleChange('ai')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AIIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{t[language].aiAssistant}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {t[language].naturalLanguage}
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            {t[language].quickCommands}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t[language].command}</TableCell>
                  <TableCell>{t[language].whatItDoes}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>"Log temperature"</TableCell>
                  <TableCell>Opens temperature logging form</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>"Show products"</TableCell>
                  <TableCell>Displays product list</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>"Create incident"</TableCell>
                  <TableCell>Opens incident reporting</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>"Check compliance"</TableCell>
                  <TableCell>Shows compliance status</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>{t[language].proTip}</strong>
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* Support */}
      <Card sx={{ mt: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t[language].needHelp}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth
                href="mailto:support@ai-haccp.com"
              >
                📧 {t[language].emailSupport}
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth
              >
                🤖 {t[language].askAI}
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>{t[language].emergency}</strong><br />
                {t[language].foodSafetyHotline} 0033619899050
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}