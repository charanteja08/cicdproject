import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: '#F1F8E9', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom align="center" color="#225c2b" fontWeight="bold">
            Welcome to AgriZen
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph align="center">
            Your one-stop marketplace for agricultural products
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="success"
              size="large"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <AgricultureIcon sx={{ fontSize: 60, color: '#2E7D32', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Fresh Produce
                </Typography>
                <Typography color="text.secondary">
                  Access a wide range of fresh, organic agricultural products directly from farmers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <LocalShippingIcon sx={{ fontSize: 60, color: '#2E7D32', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography color="text.secondary">
                  Quick and reliable delivery services to your doorstep
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <TrendingUpIcon sx={{ fontSize: 60, color: '#2E7D32', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Best Prices
                </Typography>
                <Typography color="text.secondary">
                  Competitive prices and regular discounts on quality products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: '#E8F5E9', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom color="#225c2b">
            Ready to Start Shopping?
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Join thousands of satisfied customers who trust AgriZen for their agricultural needs
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomePage; 