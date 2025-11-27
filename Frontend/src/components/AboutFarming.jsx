import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Agriculture as AgricultureIcon,
  Nature as EcoIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  LocalFlorist as CropIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';
import FarmerNavBar from './FarmerNavBar';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)',
  marginBottom: theme.spacing(3),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  boxShadow: '0 4px 16px rgba(46, 125, 50, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.2)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
}));

const AboutFarming = () => {
  const heroStyle = {
    background: 'linear-gradient(rgba(34,92,43,0.85), rgba(34,92,43,0.85)), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat',
    color: 'white',
    padding: '80px 16px',
    textAlign: 'center',
    marginBottom: '40px',
  };

  const features = [
    {
      icon: <AgricultureIcon sx={{ fontSize: 32 }} />,
      title: 'Sustainable Agriculture',
      description: 'Learn about eco-friendly farming practices that protect the environment while maximizing yield.',
    },
    {
      icon: <EcoIcon sx={{ fontSize: 32 }} />,
      title: 'Organic Farming',
      description: 'Discover the benefits of organic farming and how to transition your farm to organic methods.',
    },
    {
      icon: <WaterIcon sx={{ fontSize: 32 }} />,
      title: 'Water Management',
      description: 'Efficient irrigation techniques and water conservation strategies for sustainable farming.',
    },
    {
      icon: <SunIcon sx={{ fontSize: 32 }} />,
      title: 'Seasonal Planning',
      description: 'Plan your crops according to seasons and weather patterns for optimal growth.',
    },
    {
      icon: <CropIcon sx={{ fontSize: 32 }} />,
      title: 'Crop Rotation',
      description: 'Understand crop rotation benefits and implement effective rotation strategies.',
    },
    {
      icon: <GrowthIcon sx={{ fontSize: 32 }} />,
      title: 'Yield Optimization',
      description: 'Techniques to maximize your crop yield while maintaining quality and sustainability.',
    },
  ];

  return (
    <Box sx={{ background: '#f5f9f5', minHeight: '100vh' }}>
      <FarmerNavBar />
      <header style={heroStyle}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontFamily: "'Poppins', sans-serif" }}>
          About Farming
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 800, mx: 'auto', fontFamily: "'Inter', sans-serif" }}>
          Empowering farmers with knowledge and resources for sustainable and profitable agriculture
        </Typography>
      </header>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledPaper>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#225c2b', fontFamily: "'Poppins', sans-serif" }}>
            The Importance of Modern Farming
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
            Farming is the backbone of our society, providing food security and supporting livelihoods for millions of people worldwide. 
            Modern farming combines traditional knowledge with innovative techniques to create sustainable agricultural practices.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
            As a farmer, you play a crucial role in feeding the world while preserving our environment for future generations. 
            This platform is designed to help you connect with buyers, manage your crops effectively, and grow your farming business.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
            Whether you're growing vegetables, fruits, grains, or specialty crops, understanding modern farming practices 
            can help you increase productivity, reduce costs, and contribute to sustainable agriculture.
          </Typography>
        </StyledPaper>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#225c2b', fontFamily: "'Poppins', sans-serif", textAlign: 'center' }}>
          Key Farming Practices
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ p: 3 }}>
                  <IconBox>
                    {feature.icon}
                  </IconBox>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#225c2b', fontFamily: "'Poppins', sans-serif" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5a4f', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        <StyledPaper>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#225c2b', fontFamily: "'Poppins', sans-serif" }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
            AgriZen is committed to supporting farmers by providing a platform that connects you directly with buyers, 
            eliminates middlemen, and ensures fair prices for your produce. We believe in sustainable farming practices 
            that benefit both farmers and the environment.
          </Typography>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default AboutFarming;

