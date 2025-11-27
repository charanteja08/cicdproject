import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
const API = process.env.REACT_APP_API_BASE_URL || '/api';
const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@agrizen.com';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faf9 100%)',
  boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)',
  maxWidth: 450,
  margin: '0 auto',
}));

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(ADMIN_USERNAME);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });
    try {
      setLoading(true);
      const uname = username.trim().toLowerCase();
      if (uname !== ADMIN_USERNAME) {
        setMessage({ type: 'error', text: 'Invalid username.' });
        return;
      }
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: password })
      });
      const data = await res.json();
      if (!res.ok || !data?.success || String(data?.role) !== 'ADMIN') {
        setMessage({ type: 'error', text: data?.message || 'Invalid credentials.' });
        return;
      }
      localStorage.setItem('role', 'ADMIN');
      localStorage.setItem('email', data.email || ADMIN_EMAIL);
      localStorage.setItem('name', data.name || 'Admin');
      setMessage({ type: 'success', text: 'Login successful. Redirecting...' });
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      setMessage({ type: 'error', text: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f8faf9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f8faf9 100%)',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings 
              sx={{ 
                fontSize: 60, 
                color: '#2E7D32', 
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(46, 125, 50, 0.2))'
              }} 
            />
            <Typography 
              variant="h4" 
              fontWeight={700} 
              sx={{ 
                color: '#1B5E20',
                fontFamily: "'Poppins', sans-serif",
                mb: 1
              }}
            >
              Admin Portal
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Creator Access Only
            </Typography>
          </Box>

          {message.text && (
            <Alert severity={message.type || 'info'} sx={{ mb: 3, fontFamily: "'Inter', sans-serif" }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="admin-username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontFamily: "'Inter', sans-serif",
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="admin-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontFamily: "'Inter', sans-serif",
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !username || !password}
              sx={{
                py: 1.2,
                borderRadius: 2,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                },
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
