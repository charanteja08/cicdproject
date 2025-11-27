import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const FarmerRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isFarmer, setIsFarmer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is a farmer
    const role = localStorage.getItem('role');
    const isFarmerUser = role === 'FARMER';
    
    if (!isFarmerUser) {
      // Redirect to login if not a farmer
      navigate('/login', { replace: true });
    } else {
      setIsFarmer(true);
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isFarmer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif" }}>
          Access Denied
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "'Inter', sans-serif" }}>
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default FarmerRoute;

