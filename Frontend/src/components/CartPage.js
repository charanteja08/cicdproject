import React, { useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { GitHub, Instagram as InstagramIcon, LinkedIn as LinkedInIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import NavBar from './NavBar';

const Footer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
  color: '#fff',
  padding: theme.spacing(6, 0, 3),
  marginTop: theme.spacing(10),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  background: 'rgba(255, 255, 255, 0.1)',
  margin: theme.spacing(0, 0.5),
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
  },
}));

const primaryGradient = 'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)';

const CartPage = () => {
  const { cart, removeFromCart, incrementItem, decrementItem } = useContext(CartContext);

  const navigate = useNavigate();

  // Helper function to parse price string to number
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove currency symbols and commas, then parse
      const numericValue = parseFloat(price.replace(/[₹,]/g, '').trim());
      return isNaN(numericValue) ? 0 : numericValue;
    }
    return 0;
  };

  const total = cart.reduce((sum, item) => {
    const price = parsePrice(item.price);
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const handleProceedToCheckout = () => {
    navigate('/payment');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
      
      {cart.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6">Your cart is empty</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item, index) => (
              <Card key={`${item.name}-${index}`} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {typeof item.price === 'string' ? item.price : `₹${item.price}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => decrementItem(index)}>
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.quantity || 1}</Typography>
                        <IconButton onClick={() => incrementItem(index)}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} textAlign="right">
                      <IconButton onClick={() => removeFromCart(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Subtotal</Typography>
                  <Typography>₹{total.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      </Container>

      {/* Footer */}
      <Footer>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Logo and Description */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img
                  src="https://img.icons8.com/ios-filled/50/ffffff/plant-under-sun.png"
                  alt="logo"
                  style={{ height: 40, marginRight: 8 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  AgriZen
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 2,
                }}
              >
                Connecting farmers with buyers directly, promoting fair pricing and sustainable agriculture.
                Your trusted marketplace for fresh, organic produce.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <SocialIcon 
                  size="small" 
                  component="a" 
                  href="https://github.com/vineethnaik" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <GitHub />
                </SocialIcon>
                <SocialIcon 
                  size="small" 
                  component="a" 
                  href="https://www.instagram.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                </SocialIcon>
                <SocialIcon 
                  size="small" 
                  component="a" 
                  href="https://www.linkedin.com/in/eslavath-vineeth-naik-a8ab16285/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </SocialIcon>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Quick Links
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { name: 'Home', path: '/home' },
                  { name: 'Products', path: '/products' },
                  { name: 'Seeds & Saplings', path: '/seeds-saplings' },
                  { name: 'About Us', path: '/about' },
                ].map((link) => (
                  <Button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        color: '#fff',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Stack>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Contact Us
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ color: '#52b788' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    support@agrizen.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon sx={{ color: '#52b788' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    +91 98765 43210
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationIcon sx={{ color: '#52b788', mt: 0.5 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.6,
                    }}
                  >
                    123 Agriculture Street,<br />
                    Farm City, India 123456
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Newsletter
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                Subscribe to get updates on new products and special offers.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  borderRadius: '25px',
                  background: primaryGradient,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1b4332 0%, #40916c 100%)',
                  },
                }}
              >
                Subscribe
              </Button>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              mt: 4,
              pt: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Inter', sans-serif",
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              © {new Date().getFullYear()} AgriZen. All rights reserved. | Premium Farmer Marketplace
            </Typography>
          </Box>
        </Container>
      </Footer>
    </Box>
  );
};

export default CartPage; 