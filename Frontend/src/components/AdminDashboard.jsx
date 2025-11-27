import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  LocalFlorist as CropIcon,
  AccountCircle as FarmerIcon,
  ShoppingCart as BuyerIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NavBar from './NavBar';
import { styled } from '@mui/material/styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const StatCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(46, 125, 50, 0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(46, 125, 50, 0.3)',
  },
}));

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null, name: '' });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, crop: null });
  const [editForm, setEditForm] = useState({
    cropName: '',
    cropType: '',
    quantity: '',
    price: '',
    location: '',
    description: '',
    category: 'PRODUCTS',
    harvestDate: '',
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      // Redirect to admin login if not admin (HashRouter compatible)
      window.location.href = '#/admin';
      return;
    }
    loadData();
  }, []);

  const normalizeCategory = (category) => (category || '').toUpperCase();

  const filterCropsByTab = (list, tabIndex) => {
    if (!Array.isArray(list)) return [];
    switch (tabIndex) {
      case 1: // New Arrivals
        return list.filter(c => {
          const cat = normalizeCategory(c.category);
          return cat === 'NEW_ARRIVAL' || cat === '' || cat === 'PRODUCTS';
        });
      case 2: // Seeds & Saplings
        return list.filter(c => normalizeCategory(c.category) === 'SEEDS_SAPLINGS');
      default: // Products tab gets every item that isn't Seeds & Saplings
        return list.filter(c => normalizeCategory(c.category) !== 'SEEDS_SAPLINGS');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, farmersRes, cropsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`),
        fetch(`${API_BASE_URL}/admin/users`),
        fetch(`${API_BASE_URL}/admin/farmers`),
        fetch(`${API_BASE_URL}/admin/crops`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (farmersRes.ok) setFarmers(await farmersRes.json());
      if (cropsRes.ok) {
        const data = await cropsRes.json();
        setAllCrops(data);
        setCrops(filterCropsByTab(data, activeTab));
      } else {
        setAllCrops([]);
        setCrops([]);
      }
    } catch (error) {
      setAlert({ open: true, message: 'Failed to load data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCrops(filterCropsByTab(allCrops, activeTab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, allCrops]);

  const handleDelete = async () => {
    try {
      const endpoint = deleteDialog.type === 'user' 
        ? `${API_BASE_URL}/admin/users/${deleteDialog.id}`
        : `${API_BASE_URL}/admin/crops/${deleteDialog.id}`;
      
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        setAlert({ open: true, message: 'Deleted successfully', severity: 'success' });
        loadData();
      } else {
        setAlert({ open: true, message: 'Failed to delete', severity: 'error' });
      }
    } catch (error) {
      setAlert({ open: true, message: 'Error deleting item', severity: 'error' });
    }
    setDeleteDialog({ open: false, type: '', id: null, name: '' });
  };

  const handleUpdateCategory = async (cropId, newCategory) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/crops/${cropId}/category`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory })
      });
      if (res.ok) {
        setAlert({ open: true, message: 'Category updated successfully', severity: 'success' });
        loadData();
      } else {
        setAlert({ open: true, message: 'Failed to update category', severity: 'error' });
      }
    } catch (error) {
      setAlert({ open: true, message: 'Error updating category', severity: 'error' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenEditDialog = (crop) => {
    // Format harvestDate for date input (YYYY-MM-DD)
    let formattedDate = '';
    if (crop.harvestDate) {
      const date = new Date(crop.harvestDate);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }
    
    setEditForm({
      cropName: crop.cropName || '',
      cropType: crop.cropType || '',
      quantity: crop.quantity || '',
      price: crop.price || '',
      location: crop.location || '',
      description: crop.description || '',
      category: crop.category || 'PRODUCTS',
      harvestDate: formattedDate,
    });
    setEditDialog({ open: true, crop });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, crop: null });
    setEditForm({
      cropName: '',
      cropType: '',
      quantity: '',
      price: '',
      location: '',
      description: '',
      category: 'PRODUCTS',
      harvestDate: '',
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateCrop = async () => {
    try {
      // Prepare data with proper types
      const updateData = {
        ...editForm,
        quantity: parseInt(editForm.quantity) || 0,
        price: parseFloat(editForm.price) || 0,
      };
      
      const res = await fetch(`${API_BASE_URL}/admin/crops/${editDialog.crop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        setAlert({ open: true, message: 'Crop updated successfully', severity: 'success' });
        handleCloseEditDialog();
        loadData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setAlert({ 
          open: true, 
          message: errorData.message || 'Failed to update crop', 
          severity: 'error' 
        });
      }
    } catch (error) {
      setAlert({ open: true, message: 'Error updating crop: ' + error.message, severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf9', fontFamily: "'Poppins', sans-serif" }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1B5E20', fontFamily: "'Poppins', sans-serif" }}>
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
            }}
          >
            Refresh
          </Button>
        </Box>

        {alert.open && (
          <Alert 
            severity={alert.severity} 
            onClose={() => setAlert({ ...alert, open: false })}
            sx={{ mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{stats?.totalUsers || 0}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Users</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{stats?.totalFarmers || 0}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Farmers</Typography>
                </Box>
                <FarmerIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{stats?.totalBuyers || 0}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Buyers</Typography>
                </Box>
                <BuyerIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{stats?.totalCrops || 0}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Crop Listings</Typography>
                </Box>
                <CropIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </StatCard>
          </Grid>
        </Grid>

        {/* Users Table */}
        <Paper elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#1B5E20', fontFamily: "'Poppins', sans-serif" }}>
              All Users
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{user.name}</TableCell>
                    <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'ADMIN' ? 'error' : user.role === 'FARMER' ? 'success' : 'primary'}
                        sx={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, type: 'user', id: user.id, name: user.name })}
                        disabled={user.role === 'ADMIN'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Crops Table with Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#1B5E20', fontFamily: "'Poppins', sans-serif", mb: 2 }}>
              Crop Listings Management
            </Typography>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Products" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
              <Tab label="New Arrivals" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
              <Tab label="Seeds & Saplings" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
            </Tabs>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Crop Name</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {crops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, fontFamily: "'Inter', sans-serif", color: '#666' }}>
                      No crops found in this category. Add crops and assign them to this category.
                    </TableCell>
                  </TableRow>
                ) : (
                  crops.map((crop) => (
                    <TableRow key={crop.id} hover>
                      <TableCell>{crop.id}</TableCell>
                      <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{crop.cropName}</TableCell>
                      <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{crop.cropType}</TableCell>
                      <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>₹{crop.price}</TableCell>
                      <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{crop.quantity}</TableCell>
                      <TableCell sx={{ fontFamily: "'Inter', sans-serif" }}>{crop.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={crop.category || 'Uncategorized'}
                          size="small"
                          color={crop.category === 'PRODUCTS' ? 'primary' : crop.category === 'NEW_ARRIVAL' ? 'secondary' : 'success'}
                          sx={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(crop)}
                          title="Edit Crop Details"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'crop', id: crop.id, name: crop.cropName })}
                          title="Delete Crop"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Edit Crop Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            fontFamily: "'Poppins', sans-serif",
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#1B5E20' }}>
          Edit Crop Details
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Crop Name"
              fullWidth
              value={editForm.cropName}
              onChange={(e) => handleEditFormChange('cropName', e.target.value)}
              sx={{ fontFamily: "'Inter', sans-serif" }}
              required
            />
            <TextField
              label="Crop Type"
              fullWidth
              value={editForm.cropType}
              onChange={(e) => handleEditFormChange('cropType', e.target.value)}
              sx={{ fontFamily: "'Inter', sans-serif" }}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={editForm.quantity}
                  onChange={(e) => handleEditFormChange('quantity', e.target.value)}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  value={editForm.price}
                  onChange={(e) => handleEditFormChange('price', e.target.value)}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              label="Location"
              fullWidth
              value={editForm.location}
              onChange={(e) => handleEditFormChange('location', e.target.value)}
              sx={{ fontFamily: "'Inter', sans-serif" }}
              required
            />
            <TextField
              label="Harvest Date"
              type="date"
              fullWidth
              value={editForm.harvestDate}
              onChange={(e) => handleEditFormChange('harvestDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ fontFamily: "'Inter', sans-serif" }}
              required
            />
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: "'Inter', sans-serif" }}>Category</InputLabel>
              <Select
                value={editForm.category}
                label="Category"
                onChange={(e) => handleEditFormChange('category', e.target.value)}
                sx={{ fontFamily: "'Inter', sans-serif" }}
              >
                <MenuItem value="PRODUCTS" sx={{ fontFamily: "'Inter', sans-serif" }}>Products</MenuItem>
                <MenuItem value="NEW_ARRIVAL" sx={{ fontFamily: "'Inter', sans-serif" }}>New Arrival</MenuItem>
                <MenuItem value="SEEDS_SAPLINGS" sx={{ fontFamily: "'Inter', sans-serif" }}>Seeds & Saplings</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editForm.description}
              onChange={(e) => handleEditFormChange('description', e.target.value)}
              sx={{ fontFamily: "'Inter', sans-serif" }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            sx={{ fontFamily: "'Inter', sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCrop}
            variant="contained"
            sx={{ 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
              }
            }}
          >
            Update Crop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}>
        <DialogTitle sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'Inter', sans-serif" }}>
            Are you sure you want to delete <strong>{deleteDialog.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} sx={{ fontFamily: "'Inter', sans-serif" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;

