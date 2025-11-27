import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Button,
  Stack,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GitHub, Instagram as InstagramIcon, LinkedIn as LinkedInIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Charan Teja',
      role: 'Team Leader',
      image: '/images/charan-teja.jpg',
      initial: 'C'
    },
    {
      name: 'T. Mohanth',
      role: 'Team Member',
      image: '/images/mohanth.jpg',
      initial: 'T'
    },
    {
      name: 'E. Vineeth Naik',
      role: 'Team Member',
      image: '/images/vineeth-naik.jpg',
      initial: 'E'
    }
  ];

  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf9' }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#1B5E20', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
          About AgriZen
        </Typography>
      
      <Box sx={{ my: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1B5E20' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
          AgriZen is dedicated to revolutionizing the agricultural marketplace by creating a direct connection between farmers and buyers. 
          Our platform empowers farmers to showcase their products while providing buyers with access to fresh, high-quality agricultural goods.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
          We believe in sustainable farming practices and fair trade, ensuring that both farmers and consumers benefit from our marketplace.
        </Typography>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1B5E20' }}>
          Our Team
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mx: 'auto', 
                      mb: 2,
                      border: '4px solid #2E7D32',
                      boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                      bgcolor: '#E8F5E9',
                      color: '#2E7D32',
                      fontSize: '3rem',
                      fontWeight: 700,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {member.initial}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1B5E20' }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#1B5E20' }}>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
          We envision a future where technology bridges the gap between farmers and consumers, 
          creating a more sustainable and efficient agricultural ecosystem. Through AgriZen, 
          we aim to support local farming communities while providing consumers with access 
          to fresh, high-quality produce.
        </Typography>
      </Box>
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

export default AboutPage; 