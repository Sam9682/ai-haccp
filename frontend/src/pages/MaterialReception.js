import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  CameraAlt as CameraIcon,
  QrCodeScanner as BarcodeIcon,
  SmartToy as AIIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';

export default function MaterialReception() {
  const { language } = useLanguage();
  const [receptions, setReceptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const [formData, setFormData] = useState({
    supplier_id: '',
    product_name: '',
    category: '',
    barcode: '',
    quantity: '',
    unit: 'kg',
    expiry_date: '',
    batch_number: '',
    temperature_on_arrival: '',
    quality_notes: '',
    image_data: null
  });

  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: ''
  });

  const categories = [
    'meat', 'poultry', 'seafood', 'dairy', 'vegetables', 'fruits',
    'grains', 'bakery', 'frozen', 'canned', 'beverages', 'spices',
    'oils', 'condiments', 'snacks', 'desserts', 'other'
  ];

  const units = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'pieces', 'boxes', 'packs'];

  useEffect(() => {
    fetchReceptions();
    fetchSuppliers();
  }, []);

  const fetchReceptions = async () => {
    try {
      const response = await api.get('/material-receptions');
      setReceptions(response.data);
    } catch (error) {
      console.error('Error fetching receptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);
        setFormData({ ...formData, image_data: imageData });
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setImagePreview(imageData);
    setFormData({ ...formData, image_data: imageData });
    
    // Stop camera
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setCameraActive(false);
    
    analyzeImage(imageData);
  };

  const analyzeImage = async (imageData) => {
    setAiAnalyzing(true);
    try {
      const response = await api.post('/analyze-reception-image', {
        image: imageData
      });

      if (response.data.success && response.data.analysis) {
        const analysis = response.data.analysis;
        
        // Auto-fill form with AI analysis results
        setFormData(prev => ({
          ...prev,
          product_name: analysis.product_name || prev.product_name,
          category: analysis.category || prev.category,
          barcode: analysis.barcode || prev.barcode,
          quantity: analysis.quantity || prev.quantity,
          unit: analysis.unit || prev.unit,
          expiry_date: analysis.expiry_date || prev.expiry_date,
          batch_number: analysis.batch_number || prev.batch_number
        }));

        alert(`AI Analysis Complete!\nConfidence: ${(response.data.confidence * 100).toFixed(1)}%\nPlease verify the auto-filled information.`);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('AI analysis failed. Please fill in the information manually.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleBarcodeInput = (event) => {
    const barcode = event.target.value;
    setFormData({ ...formData, barcode });
    
    // Mock barcode lookup - in production, integrate with barcode database
    if (barcode.length >= 8) {
      // Simulate barcode recognition
      setTimeout(() => {
        const mockProducts = {
          '1234567890123': { name: 'Fresh Chicken Breast', category: 'poultry' },
          '9876543210987': { name: 'Organic Salmon Fillet', category: 'seafood' },
          '5555666677778': { name: 'Mixed Vegetables', category: 'vegetables' }
        };
        
        const product = mockProducts[barcode];
        if (product) {
          setFormData(prev => ({
            ...prev,
            product_name: product.name,
            category: product.category
          }));
        }
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const receptionData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        temperature_on_arrival: formData.temperature_on_arrival ? 
          parseFloat(formData.temperature_on_arrival) : null,
        supplier_id: parseInt(formData.supplier_id)
      };

      await api.post('/material-reception', receptionData);
      setOpen(false);
      resetForm();
      fetchReceptions();
    } catch (error) {
      console.error('Error creating reception:', error);
      alert('Failed to create reception record');
    }
  };

  const resetForm = () => {
    setFormData({
      supplier_id: '',
      product_name: '',
      category: '',
      barcode: '',
      quantity: '',
      unit: 'kg',
      expiry_date: '',
      batch_number: '',
      temperature_on_arrival: '',
      quality_notes: '',
      image_data: null
    });
    setImagePreview(null);
    setCameraActive(false);
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/suppliers', supplierFormData);
      setSupplierDialogOpen(false);
      setSupplierFormData({ name: '', contact_person: '', email: '', phone: '' });
      fetchSuppliers();
      setFormData({ ...formData, supplier_id: response.data.id });
    } catch (error) {
      console.error('Error creating supplier:', error);
      alert('Failed to create supplier');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      meat: 'error', poultry: 'warning', seafood: 'info',
      dairy: 'primary', vegetables: 'success', fruits: 'secondary'
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return <Typography>{t('loading', language)}</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('materialReception', language)}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          {t('receiveMaterials', language)}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        {t('materialReceptionInfo', language)}
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('product', language)}</TableCell>
              <TableCell>{t('category', language)}</TableCell>
              <TableCell>{t('quantity', language)}</TableCell>
              <TableCell>{t('expiryDate', language)}</TableCell>
              <TableCell>{t('temperature', language)}</TableCell>
              <TableCell>{t('received', language)}</TableCell>
              <TableCell>{t('aiAnalysis', language)}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receptions.map((reception) => (
              <TableRow key={reception.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {reception.product_name}
                  </Typography>
                  {reception.barcode && (
                    <Typography variant="caption" color="textSecondary">
                      {t('barcode', language)}: {reception.barcode}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={reception.category} 
                    color={getCategoryColor(reception.category)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {reception.quantity} {reception.unit}
                </TableCell>
                <TableCell>
                  {reception.expiry_date ? 
                    new Date(reception.expiry_date).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {reception.temperature_on_arrival ? 
                    `${reception.temperature_on_arrival}°C` : 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(reception.received_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {reception.ai_analysis?.success ? (
                    <Chip label="AI Analyzed" color="success" size="small" />
                  ) : (
                    <Chip label="Manual" color="default" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <InventoryIcon sx={{ mr: 1 }} />
              {t('receiveMaterials', language)}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Image Capture Section */}
              <Grid item xs={12}>
                <Card sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <AIIcon sx={{ mr: 1 }} />
                      {t('aiAnalysis', language)}
                    </Typography>
                    
                    <Box display="flex" gap={1} mb={2}>
                      <Button
                        variant="outlined"
                        startIcon={<CameraIcon />}
                        onClick={startCamera}
                        disabled={cameraActive}
                      >
                        {t('takePhoto', language)}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {t('uploadImage', language)}
                      </Button>
                    </Box>

                    {cameraActive && (
                      <Box>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }}
                        />
                        <Button
                          variant="contained"
                          onClick={capturePhoto}
                          fullWidth
                        >
                          {t('takePhoto', language)}
                        </Button>
                      </Box>
                    )}

                    {imagePreview && (
                      <Box mt={2}>
                        <img
                          src={imagePreview}
                          alt="Reception preview"
                          style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
                        />
                        {aiAnalyzing && (
                          <Box display="flex" alignItems="center" mt={1}>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            <Typography variant="body2">{t('aiAnalyzing', language)}</Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </CardContent>
                </Card>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" gap={1}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('supplier', language)}</InputLabel>
                    <Select
                      value={formData.supplier_id}
                      onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                    >
                      {suppliers.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={() => setSupplierDialogOpen(true)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('barcode', language)}
                  fullWidth
                  value={formData.barcode}
                  onChange={handleBarcodeInput}
                  InputProps={{
                    endAdornment: <BarcodeIcon color="action" />
                  }}
                  placeholder={t('scanBarcode', language)}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  label={t('productName', language)}
                  fullWidth
                  required
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>{t('category', language)}</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label={t('quantity', language)}
                  type="number"
                  fullWidth
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>{t('unit', language)}</InputLabel>
                  <Select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label={t('temperatureOnArrival', language) + ' (°C)'}
                  type="number"
                  fullWidth
                  value={formData.temperature_on_arrival}
                  onChange={(e) => setFormData({ ...formData, temperature_on_arrival: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('expiryDate', language)}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('batchNumber', language)}
                  fullWidth
                  value={formData.batch_number}
                  onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={t('qualityNotes', language)}
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.quality_notes}
                  onChange={(e) => setFormData({ ...formData, quality_notes: e.target.value })}
                  placeholder={t('qualityNotes', language) + '...'}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false); resetForm(); }}>
              {t('cancel', language)}
            </Button>
            <Button type="submit" variant="contained">
              {t('save', language)}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Supplier Creation Dialog */}
      <Dialog open={supplierDialogOpen} onClose={() => setSupplierDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSupplierSubmit}>
          <DialogTitle>Create New Supplier</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Supplier Name"
                  fullWidth
                  required
                  value={supplierFormData.name}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contact Person"
                  fullWidth
                  value={supplierFormData.contact_person}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, contact_person: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={supplierFormData.email}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={supplierFormData.phone}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, phone: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSupplierDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Supplier
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}