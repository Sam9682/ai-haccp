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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert
} from '@mui/material';
import { Add as AddIcon, CleaningServices as CleanIcon, Archive as ArchiveIcon, History as HistoryIcon } from '@mui/icons-material';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';

export default function CleaningPlan() {
  const { language } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [archivedPlans, setArchivedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [open, setOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [roomCleanings, setRoomCleanings] = useState([]);
  const canvasRef = useRef(null);
  const dialogCanvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cleaning_frequency: 'daily',
    estimated_duration: '',
    rooms: []
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({ name: '', x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    fetchPlans();
    fetchArchivedPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchRoomCleanings(selectedPlan.id);
      drawPlan(selectedPlan);
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedPlan) {
      drawPlan(selectedPlan);
    }
  }, [roomCleanings]);

  useEffect(() => {
    if (open) {
      setTimeout(() => drawDialogCanvas(), 100);
    }
  }, [open, formData.rooms]);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/cleaning-plans');
      setPlans(response.data);
      if (response.data.length > 0) {
        setSelectedPlan(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching cleaning plans:', error);
    }
  };

  const fetchArchivedPlans = async () => {
    try {
      const response = await api.get('/cleaning-plans/archived');
      setArchivedPlans(response.data);
    } catch (error) {
      console.error('Error fetching archived plans:', error);
    }
  };

  const checkAndArchivePlans = async () => {
    try {
      await api.post('/cleaning-plans/check-archive');
      fetchPlans();
      fetchArchivedPlans();
    } catch (error) {
      console.error('Error checking/archiving plans:', error);
    }
  };

  const archivePlan = async (planId) => {
    try {
      await api.post(`/cleaning-plans/${planId}/archive`);
      fetchPlans();
      fetchArchivedPlans();
    } catch (error) {
      console.error('Error archiving plan:', error);
    }
  };

  const fetchRoomCleanings = async (planId) => {
    try {
      const response = await api.get(`/room-cleanings/${planId}`);
      setRoomCleanings(response.data);
    } catch (error) {
      console.error('Error fetching room cleanings:', error);
    }
  };

  const drawPlan = (plan) => {
    const canvas = canvasRef.current;
    if (!canvas || !plan.rooms) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rooms
    plan.rooms.forEach(room => {
      const isRecentlyCleaned = roomCleanings.some(cleaning => 
        cleaning.room_name === room.name && 
        new Date(cleaning.cleaned_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      // Room background
      ctx.fillStyle = isRecentlyCleaned ? '#c8e6c9' : '#ffcdd2';
      ctx.fillRect(room.x, room.y, room.width, room.height);

      // Room border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Room label
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, room.x + room.width/2, room.y + room.height/2);

      // Status indicator
      ctx.fillStyle = isRecentlyCleaned ? '#4caf50' : '#f44336';
      ctx.beginPath();
      ctx.arc(room.x + room.width - 10, room.y + 10, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleCanvasClick = async (event) => {
    if (!selectedPlan) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked room
    const clickedRoom = selectedPlan.rooms.find(room => 
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
    );

    if (clickedRoom) {
      try {
        await api.post('/room-cleaning', {
          room_name: clickedRoom.name,
          cleaning_plan_id: selectedPlan.id,
          notes: `Room cleaned via interactive plan`
        });
        
        fetchRoomCleanings(selectedPlan.id);
      } catch (error) {
        console.error('Error marking room as cleaned:', error);
      }
    }
  };

  const drawDialogCanvas = () => {
    const canvas = dialogCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw existing rooms
    formData.rooms.forEach(room => {
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(room.x, room.y, room.width, room.height);
      ctx.strokeStyle = '#1976d2';
      ctx.lineWidth = 2;
      ctx.strokeRect(room.x, room.y, room.width, room.height);
      
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, room.x + room.width/2, room.y + room.height/2);
    });

    // Draw current room being drawn
    if (isDrawing && currentRoom.width !== 0 && currentRoom.height !== 0) {
      ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
      ctx.fillRect(currentRoom.x, currentRoom.y, currentRoom.width, currentRoom.height);
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentRoom.x, currentRoom.y, currentRoom.width, currentRoom.height);
    }
  };

  const handleMouseDown = (event) => {
    if (!open) return;
    
    const canvas = dialogCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentRoom({ ...currentRoom, x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || !open) return;
    
    const canvas = dialogCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setCurrentRoom(prev => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y
    }));
    
    drawDialogCanvas();
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (Math.abs(currentRoom.width) > 20 && Math.abs(currentRoom.height) > 20) {
      const roomName = prompt('Enter room name:');
      if (roomName) {
        const normalizedRoom = {
          name: roomName,
          x: currentRoom.width < 0 ? currentRoom.x + currentRoom.width : currentRoom.x,
          y: currentRoom.height < 0 ? currentRoom.y + currentRoom.height : currentRoom.y,
          width: Math.abs(currentRoom.width),
          height: Math.abs(currentRoom.height)
        };
        setFormData(prev => ({
          ...prev,
          rooms: [...prev.rooms, normalizedRoom]
        }));
      }
    }
    setCurrentRoom({ name: '', x: 0, y: 0, width: 0, height: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null
      };
      
      await api.post('/cleaning-plans', planData);
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        cleaning_frequency: 'daily',
        estimated_duration: '',
        rooms: []
      });
      fetchPlans();
    } catch (error) {
      console.error('Error creating cleaning plan:', error);
    }
  };

  const getRoomStatus = (roomName) => {
    const lastCleaning = roomCleanings.find(c => c.room_name === roomName);
    if (!lastCleaning) return { status: t('neverCleaned', language), color: 'error' };
    
    const cleanedAt = new Date(lastCleaning.cleaned_at);
    const hoursAgo = (Date.now() - cleanedAt.getTime()) / (1000 * 60 * 60);
    
    const dateTime = cleanedAt.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const prefix = language === 'fr' ? 'Nettoyé' : 'Cleaned';
    
    let color = 'success';
    if (hoursAgo >= 48) color = 'error';
    else if (hoursAgo >= 24) color = 'warning';
    
    return { status: `${prefix} ${dateTime}`, color };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('cleaningManagement', language)}</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setArchiveOpen(true)}
            sx={{ mr: 1 }}
          >
            {t('viewArchive', language)}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArchiveIcon />}
            onClick={checkAndArchivePlans}
            sx={{ mr: 1 }}
          >
            {t('checkArchive', language)}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            {t('createPlan', language)}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('interactiveCleaningPlan', language)}
                {selectedPlan && ` - ${selectedPlan.name}`}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('clickRoomInfo', language)}
              </Alert>

              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ 
                  border: '1px solid #ccc', 
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '600px'
                }}
                onClick={handleCanvasClick}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('roomStatus', language)}
              </Typography>
              
              {selectedPlan && selectedPlan.rooms && selectedPlan.rooms.map((room, index) => {
                const status = getRoomStatus(room.name);
                return (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{room.name}</Typography>
                    <Chip 
                      label={status.status} 
                      color={status.color} 
                      size="small"
                    />
                  </Box>
                );
              })}

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                {t('availablePlans', language)}
              </Typography>
              
              {plans.map((plan) => (
                <Box key={plan.id} display="flex" alignItems="center" mb={1}>
                  <Button
                    variant={selectedPlan?.id === plan.id ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {plan.name}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => archivePlan(plan.id)}
                    sx={{ ml: 1, minWidth: 'auto' }}
                  >
                    <ArchiveIcon fontSize="small" />
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{t('createCleaningPlan', language)}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  label={t('planName', language)}
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('frequency', language)}</InputLabel>
                  <Select
                    value={formData.cleaning_frequency}
                    onChange={(e) => setFormData({ ...formData, cleaning_frequency: e.target.value })}
                  >
                    <MenuItem value="daily">{t('daily', language)}</MenuItem>
                    <MenuItem value="weekly">{t('weekly', language)}</MenuItem>
                    <MenuItem value="monthly">{t('monthly', language)}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('description', language)}
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('estimatedDuration', language)}
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  {t('drawRoomsInfo', language)}
                </Typography>
                <canvas
                  ref={dialogCanvasRef}
                  width={500}
                  height={300}
                  style={{ border: '1px solid #ccc', cursor: 'crosshair', width: '100%' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>{t('cancel', language)}</Button>
            <Button type="submit" variant="contained">{t('createPlan', language)}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={archiveOpen} onClose={() => setArchiveOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('archivedPlans', language)}</DialogTitle>
        <DialogContent>
          {archivedPlans.length === 0 ? (
            <Typography>{t('noArchivedPlans', language)}</Typography>
          ) : (
            archivedPlans.map((plan) => (
              <Card key={plan.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{plan.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('frequency', language)}: {t(plan.cleaning_frequency, language)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('archivedAt', language)}: {new Date(plan.archived_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">{plan.description}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveOpen(false)}>{t('close', language)}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}