import React, { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  console.log('Products component rendered, open:', open);
  
  useEffect(() => {
    console.log('Products dialog open state changed:', open);
  }, [open]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    allergens: '',
    shelf_life_days: '',
    storage_temp_min: '',
    storage_temp_max: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    console.log('Add Product button clicked, current open state:', open);
    setOpen(true);
    console.log('Set open to true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Product form submitted with data:', formData);
    try {
      const productData = {
        ...formData,
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [],
        shelf_life_days: formData.shelf_life_days ? parseInt(formData.shelf_life_days) : null,
        storage_temp_min: formData.storage_temp_min ? parseFloat(formData.storage_temp_min) : null,
        storage_temp_max: formData.storage_temp_max ? parseFloat(formData.storage_temp_max) : null
      };
      
      console.log('Sending product payload:', productData);
      const response = await api.post('/products', productData);
      console.log('Product response:', response.data);
      
      setOpen(false);
      setFormData({
        name: '',
        category: '',
        allergens: '',
        shelf_life_days: '',
        storage_temp_min: '',
        storage_temp_max: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return <Typography>Loading products...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Product Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Category: {product.category || 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Shelf Life: {product.shelf_life_days ? `${product.shelf_life_days} days` : 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Storage: {product.storage_temp_min && product.storage_temp_max 
                    ? `${product.storage_temp_min}°C to ${product.storage_temp_max}°C` 
                    : 'N/A'}
                </Typography>
                {product.allergens && product.allergens.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="body2" gutterBottom>
                      Allergens:
                    </Typography>
                    {product.allergens.map((allergen, index) => (
                      <Chip
                        key={index}
                        label={allergen}
                        size="small"
                        color="warning"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Product Name"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Category"
                  fullWidth
                  variant="outlined"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Allergens (comma separated)"
                  fullWidth
                  variant="outlined"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="milk, eggs, nuts"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  label="Shelf Life (days)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.shelf_life_days}
                  onChange={(e) => setFormData({ ...formData, shelf_life_days: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  label="Min Storage Temp (°C)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.storage_temp_min}
                  onChange={(e) => setFormData({ ...formData, storage_temp_min: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  label="Max Storage Temp (°C)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.storage_temp_max}
                  onChange={(e) => setFormData({ ...formData, storage_temp_max: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Product</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}