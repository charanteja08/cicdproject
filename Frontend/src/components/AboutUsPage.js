import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavBar from './NavBar';

const TeamAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  marginBottom: theme.spacing(2),
}));

const team = [
  { name: 'ESLAVATH VINAATH NAIK', role: 'Founder & Lead Developer', img: '' },
  { name: 'JYOTSNA TALASILA', role: 'UI/UX Designer', img: '' },
  { name: 'BHARGAVI', role: 'Backend Engineer', img: '' },
];

const AboutUsPage = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
    <NavBar />
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} color="#225c2b" gutterBottom align="center">
        About AgriZen
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" mb={4}>
        Empowering farmers and buyers with a direct, transparent, and sustainable agricultural marketplace.
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Our Mission
      </Typography>
      <Typography variant="body1" mb={4}>
        AgriZen is dedicated to connecting farmers directly with buyers, eliminating middlemen, and ensuring fair prices for all. We believe in sustainable agriculture, transparency, and empowering local communities through technology.
      </Typography>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Meet the Team
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {team.map((member, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card elevation={2} sx={{ textAlign: 'center', py: 3 }}>
              <CardContent>
                <TeamAvatar src={member.img} alt={member.name} />
                <Typography variant="h6" fontWeight={700}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">{member.role}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {new Date().getFullYear()} AgriZen. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default AboutUsPage; 