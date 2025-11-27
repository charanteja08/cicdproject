import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const BuyerRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isBuyer, setIsBuyer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is a buyer (not a farmer or admin)
    const role = localStorage.getItem('role');
    
    if (role === 'FARMER') {
      // Redirect farmers to farmer portal
      navigate('/farmer-dashboard', { replace: true });
      return;
    }
    
    if (role === 'ADMIN') {
      // Redirect admins to admin dashboard
      navigate('/admin-dashboard', { replace: true });
      return;
    }
    
    // Allow buyers and guests (no role)
    setIsBuyer(true);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default BuyerRoute;

