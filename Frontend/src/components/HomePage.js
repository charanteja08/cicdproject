import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Stack,
  IconButton,
  Chip,
  Rating,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  EmojiNature as EmojiNatureIcon,
  MonetizationOn as MonetizationOnIcon,
  VerifiedUser as VerifiedUserIcon,
  LocalFlorist as VegetablesIcon,
  Park as SeedsIcon,
  Science as FertilizersIcon,
  Build as ToolsIcon,
  ShoppingCart as CartIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  GitHub,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import NavBar from './NavBar';
import { CartContext } from './CartContext';

// Premium color theme
const primaryGradient = 'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)';
const darkGreen = '#1B5E20';
const mediumGreen = '#2E7D32';
const lightGreen = '#4CAF50';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(82, 183, 136, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(82, 183, 136, 0.5);
  }
`;

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '600px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://t3.ftcdn.net/jpg/08/04/22/42/360_F_804224219_QdNW7DlskOWvDzon8xM4LQuxX62bdvdm.jpg') center/cover no-repeat`,
  color: '#fff',
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  [theme.breakpoints.down('md')]: {
    minHeight: '500px',
    padding: theme.spacing(6, 2),
  },
}));

const HeroHeading = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 800,
  fontSize: '3.5rem',
  letterSpacing: '1px',
  lineHeight: 1.2,
  marginBottom: theme.spacing(2),
  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
  animation: `${fadeIn} 1s ease-out`,
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const HeroSubheading = styled(Typography)(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: '1.5rem',
  letterSpacing: '0.5px',
  lineHeight: 1.6,
  marginBottom: theme.spacing(4),
  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
  animation: `${fadeIn} 1.2s ease-out`,
  [theme.breakpoints.down('md')]: {
    fontSize: '1.25rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}));

const ShopNowButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: '1.2rem',
  padding: theme.spacing(1.5, 5),
  borderRadius: '50px',
  background: primaryGradient,
  color: '#fff',
  textTransform: 'none',
  boxShadow: '0 8px 24px rgba(45, 106, 79, 0.4)',
  animation: `${slideUp} 1.4s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1b4332 0%, #40916c 100%)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(45, 106, 79, 0.5)',
    animation: `${glow} 2s ease-in-out infinite`,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  padding: theme.spacing(3),
  textAlign: 'center',
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(82, 183, 136, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 40px rgba(82, 183, 136, 0.2)',
    borderColor: 'rgba(82, 183, 136, 0.3)',
  },
}));

const IconCircle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: 40,
    color: mediumGreen,
  },
  '&:hover': {
    transform: 'scale(1.1)',
    background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(4),
  textAlign: 'center',
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-4px)',
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(3),
  textAlign: 'center',
  background: '#ffffff',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(82, 183, 136, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 32px rgba(82, 183, 136, 0.2)',
    borderColor: 'rgba(82, 183, 136, 0.3)',
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  overflow: 'hidden',
  background: '#ffffff',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(82, 183, 136, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(82, 183, 136, 0.2)',
    borderColor: 'rgba(82, 183, 136, 0.3)',
  },
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  borderRadius: '12px',
  textTransform: 'none',
  background: primaryGradient,
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1b4332 0%, #40916c 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(45, 106, 79, 0.4)',
  },
}));

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
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-3px) scale(1.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: '2.5rem',
  color: darkGreen,
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  letterSpacing: '0.5px',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);
  const [userName, setUserName] = useState(localStorage.getItem('name') || '');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
    const interval = setInterval(() => {
      const currentName = localStorage.getItem('name');
      if (currentName !== userName) {
        setUserName(currentName || '');
      }
    }, 500);
    return () => clearInterval(interval);
  }, [userName]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <EmojiNatureIcon />,
      title: 'Direct from Farmers',
      desc: 'Fresh, authentic produce delivered straight from local farms to your doorstep.',
    },
    {
      icon: <MonetizationOnIcon />,
      title: 'Best Prices',
      desc: 'No middlemen. Enjoy fair prices and support sustainable agriculture.',
    },
    {
      icon: <VerifiedUserIcon />,
      title: 'Trusted & Secure',
      desc: 'Verified sellers, secure payments, and a satisfaction guarantee.',
    },
  ];

  const testimonials = [
    {
      name: 'Ravi Kumar',
      role: 'Buyer',
      text: 'AgriZen made it so easy to get fresh veggies at great prices. I love supporting local farmers!',
      avatar: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=2d6a4f&color=fff&size=128',
      rating: 5,
    },
    {
      name: 'Lakshmi Devi',
      role: 'Farmer',
      text: 'I can sell my produce directly and get paid fairly. The platform is simple and effective.',
      avatar: 'https://ui-avatars.com/api/?name=Lakshmi+Devi&background=52b788&color=fff&size=128',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Buyer',
      text: 'The quality of products is amazing and delivery is always on time. Highly recommended!',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=2d6a4f&color=fff&size=128',
      rating: 5,
    },
  ];

  const categories = [
    {
      name: 'Vegetables',
      icon: <VegetablesIcon sx={{ fontSize: 48, color: mediumGreen }} />,
      path: '/products',
    },
    {
      name: 'Seeds',
      icon: <SeedsIcon sx={{ fontSize: 48, color: mediumGreen }} />,
      path: '/seeds-saplings',
    },
    {
      name: 'Fertilizers',
      icon: <FertilizersIcon sx={{ fontSize: 48, color: mediumGreen }} />,
      path: '/products',
    },
    {
      name: 'Tools',
      icon: <ToolsIcon sx={{ fontSize: 48, color: mediumGreen }} />,
      path: '/products',
    },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf9' }}>
      <NavBar />
      
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <HeroHeading>
            Welcome to AgriZen{userName ? `, ${userName}` : ''}
          </HeroHeading>
          <HeroSubheading>
            India's trusted marketplace for fresh, sustainable, and fairly-priced agricultural products.
          </HeroSubheading>
          <ShopNowButton
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            endIcon={<ArrowForwardIcon />}
          >
            Shop Now
          </ShopNowButton>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container sx={{ py: 10 }}>
        <SectionTitle>Why Choose AgriZen?</SectionTitle>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <FeatureCard>
                <IconCircle>{feature.icon}</IconCircle>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: darkGreen,
                    mb: 2,
                    letterSpacing: '0.5px',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#666',
                    lineHeight: 1.8,
                    letterSpacing: '0.3px',
                  }}
                >
                  {feature.desc}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Categories Section */}
      <Box sx={{ bgcolor: '#ffffff', py: 10 }}>
        <Container>
          <SectionTitle>Shop by Category</SectionTitle>
          <Grid container spacing={4} justifyContent="center">
            {categories.map((category, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <CategoryCard onClick={() => navigate(category.path)}>
                  <Box sx={{ mb: 2 }}>{category.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: darkGreen,
                    }}
                  >
                    {category.name}
                  </Typography>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#e8f5e9', py: 10 }}>
        <Container>
          <SectionTitle>What Our Users Say</SectionTitle>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Carousel
              autoPlay={true}
              interval={5000}
              animation="fade"
              indicators={true}
              navButtonsAlwaysVisible={true}
              sx={{
                '& .MuiIconButton-root': {
                  color: mediumGreen,
                  '&:hover': {
                    background: 'rgba(46, 125, 50, 0.1)',
                  },
                },
              }}
            >
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx}>
                  <Stack alignItems="center" spacing={3}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{
                        width: 100,
                        height: 100,
                        border: '4px solid #52b788',
                        boxShadow: '0 4px 15px rgba(82, 183, 136, 0.3)',
                      }}
                    />
                    <Rating value={testimonial.rating} readOnly sx={{ color: '#FFB300' }} />
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: 'italic',
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        color: '#555',
                        px: 2,
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                          color: darkGreen,
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          color: '#666',
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Stack>
                </TestimonialCard>
              ))}
            </Carousel>
          </Box>
        </Container>
      </Box>

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
                    +91 8125139561
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
                    Plot No . 301 Narendra Enclave Opp Water plant Rd,<br />
                    Tadeapalli, Guntur, Andhra Pradesh 522501
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

export default HomePage;
