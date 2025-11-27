import React, { useState, useContext } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Slider,
  Checkbox,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControl,
  Paper,
  Container,
  IconButton,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Facebook, Twitter, Instagram, LinkedIn, ShoppingCart } from '@mui/icons-material';
import NavBar from './NavBar';
import { SearchContext } from './SearchContext';
import { CartContext } from './CartContext';

const Sidebar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  minWidth: 260,
  maxWidth: 320,
  marginRight: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    marginRight: 0,
    marginBottom: theme.spacing(4),
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  marginBottom: theme.spacing(3),
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#1B5E20',
  color: 'white',
  padding: theme.spacing(6, 0),
  marginTop: theme.spacing(8),
}));

const categories = ['Seeds', 'Saplings'];
const practices = ['Organic', 'Conventional', 'Regenerative', 'Biodynamic', 'Hydroponic'];

const products = [
  {
    name: 'Hybrid Tomato Seeds',
    category: 'Seeds',
    farm: 'SeedWorks',
    location: 'Nashik, MH',
    price: '₹40',
    unit: '/ pack',
    fairPrice: false,
    organic: false,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Carrot Seeds',
    category: 'Seeds',
    farm: 'RootWorks',
    location: 'Indore, MP',
    price: '₹35',
    unit: '/ pack',
    fairPrice: false,
    organic: true,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Brinjal (Eggplant) Saplings',
    category: 'Saplings',
    farm: 'Green Nursery',
    location: 'Bangalore, KA',
    price: '₹70',
    unit: '/ 10 saplings',
    fairPrice: true,
    organic: true,
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cabbage Saplings',
    category: 'Saplings',
    farm: 'Leafy Greens',
    location: 'Watsonville, CA',
    price: '₹80',
    unit: '/ 10 saplings',
    fairPrice: true,
    organic: false,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  },
];

const SeedsAndSaplingsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPractices, setSelectedPractices] = useState([]);
  const [priceRange, setPriceRange] = useState([30, 180]);
  const [sort, setSort] = useState('Newest');
  const [view, setView] = useState('Grid');
  const { search } = useContext(SearchContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  // Handle filters
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };
  const handlePracticeChange = (practice) => {
    setSelectedPractices((prev) =>
      prev.includes(practice) ? prev.filter((p) => p !== practice) : [...prev, practice]
    );
  };

  // Filtering logic
  let filteredProducts = products.filter(product =>
    (search === '' ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.farm.toLowerCase().includes(search.toLowerCase()) ||
      product.location.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
    (selectedPractices.length === 0 || selectedPractices.some(prac => product.organic && prac === 'Organic')) &&
    (parseFloat(product.price.replace('₹', '')) >= priceRange[0] && parseFloat(product.price.replace('₹', '')) <= priceRange[1])
  );

  // Sorting logic
  if (sort === 'PriceLow') {
    filteredProducts = filteredProducts.sort((a, b) => parseFloat(a.price.replace('₹', '')) - parseFloat(b.price.replace('₹', '')));
  } else if (sort === 'PriceHigh') {
    filteredProducts = filteredProducts.sort((a, b) => parseFloat(b.price.replace('₹', '')) - parseFloat(a.price.replace('₹', '')));
  }

  // Modal handlers
  const handleViewProduct = (product) => {
    addToCart(product);
    setSelectedProduct(product);
    setModalOpen(true);
    setSnackbarOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ pt: 6, pb: 2 }}>
        <Grid container spacing={4}>
          {/* Sidebar Filters */}
          <Grid item xs={12} md={3}>
            <Sidebar elevation={2}>
              <Typography variant="h6" gutterBottom>Filters</Typography>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>Categories</Typography>
                <FormGroup>
                  {categories.map((cat) => (
                    <FormControlLabel
                      key={cat}
                      control={<Checkbox checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} />}
                      label={cat}
                    />
                  ))}
                </FormGroup>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>Price Range</Typography>
                <Slider
                  value={priceRange}
                  min={30}
                  max={180}
                  onChange={(e, val) => setPriceRange(val)}
                  valueLabelDisplay="auto"
                  sx={{ mt: 1, mb: 1 }}
                />
                <Box display="flex" justifyContent="space-between">
                  <TextField size="small" value={priceRange[0]} sx={{ width: 60 }} />
                  <Typography sx={{ mx: 1 }}>to</Typography>
                  <TextField size="small" value={priceRange[1]} sx={{ width: 60 }} />
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>Farming Practices</Typography>
                <FormGroup>
                  {practices.map((practice) => (
                    <FormControlLabel
                      key={practice}
                      control={<Checkbox checked={selectedPractices.includes(practice)} onChange={() => handlePracticeChange(practice)} />}
                      label={practice}
                    />
                  ))}
                </FormGroup>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>Location</Typography>
                <TextField size="small" placeholder="Enter location" fullWidth />
              </Box>
            </Sidebar>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={700} color="#225c2b">Seeds & Saplings</Typography>
              <Box display="flex" gap={2}>
                <FormControl size="small">
                  <InputLabel>Sort</InputLabel>
                  <Select value={sort} label="Sort" onChange={e => setSort(e.target.value)}>
                    <MenuItem value="Newest">Newest</MenuItem>
                    <MenuItem value="PriceLow">Price: Low to High</MenuItem>
                    <MenuItem value="PriceHigh">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>View</InputLabel>
                  <Select value={view} label="View" onChange={e => setView(e.target.value)}>
                    <MenuItem value="Grid">Grid View</MenuItem>
                    <MenuItem value="List">List View</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {filteredProducts.map((product, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <ProductCard>
                    <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between' }}>
                      {product.fairPrice && <Chip label="Fair Price" color="primary" size="small" sx={{ fontWeight: 700 }} />}
                      {product.organic && <Chip label="Organic" color="success" size="small" sx={{ fontWeight: 700 }} />}
                    </Box>
                    <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f3f3f3' }}>
                      <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: 8 }} />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>{product.farm} • {product.location}</Typography>
                      <Typography variant="h6" color="success.main" fontWeight={700}>{product.price} <Typography component="span" color="text.secondary" fontSize={16}>{product.unit}</Typography></Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button variant="contained" color="success" fullWidth startIcon={<ShoppingCart />} onClick={() => handleViewProduct(product)}>
                        View Product
                      </Button>
                    </CardActions>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* Product Details Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxHeight: 200, borderRadius: 12 }} />
              </Box>
              <DialogContentText>
                <strong>Farm:</strong> {selectedProduct.farm}<br />
                <strong>Location:</strong> {selectedProduct.location}<br />
                <strong>Price:</strong> {selectedProduct.price} {selectedProduct.unit}<br />
                {selectedProduct.fairPrice && <Chip label="Fair Price" color="primary" size="small" sx={{ fontWeight: 700, ml: 1 }} />}
                {selectedProduct.organic && <Chip label="Organic" color="success" size="small" sx={{ fontWeight: 700, ml: 1 }} />}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Added to cart successfully! Get ready for payment.
        </Alert>
      </Snackbar>
      {/* Footer */}
      <Footer>
        <Container maxWidth="lg">
          {/* ...footer code... */}
        </Container>
      </Footer>
    </Box>
  );
};

export default SeedsAndSaplingsPage; 