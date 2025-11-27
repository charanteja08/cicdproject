import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.email && formData.password) {
      const emailOk = /^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(formData.email);
      if (!emailOk) {
        setError('Please enter a valid email address.');
        return;
      }
      setLoading(true);
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 8000);
        const pingRes = await fetch(`${API_BASE_URL}/auth/ping`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!pingRes.ok) {
          setError(`Cannot connect to backend API at ${API_BASE_URL}.`);
          setLoading(false);
          return;
        }

        // Login with email and password
        const payload = { 
          email: formData.email, 
          password: formData.password,
          role: null
        };
        
        const loginCtrl = new AbortController();
        const lt = setTimeout(() => loginCtrl.abort(), 12000);
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
          signal: loginCtrl.signal,
        });
        clearTimeout(lt);

        if (res.ok) {
          const data = await res.json();
          
          if (data && data.success) {
            const userRole = data.role?.toString() || data.role;
            
            localStorage.setItem('userId', String(data.userId));
            localStorage.setItem('role', userRole);
            localStorage.setItem('name', data.name || 'User');
            localStorage.setItem('email', data.email || formData.email);

            // Ensure farmerId exists for farmer portal
            if (userRole === 'FARMER') {
              let farmerId = localStorage.getItem('farmerId');
              if (!farmerId) {
                try {
                  const byEmail = await fetch(`${API_BASE_URL}/farmers/by-email?email=${encodeURIComponent(formData.email)}`);
                  if (byEmail.ok) {
                    const f = await byEmail.json();
                    farmerId = f.id;
                    localStorage.setItem('farmerId', farmerId);
                  } else {
                    const createRes = await fetch(`${API_BASE_URL}/farmers`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: localStorage.getItem('name') || 'Farmer', email: formData.email })
                    });
                    if (createRes.ok) {
                      const f = await createRes.json();
                      farmerId = f.id;
                      localStorage.setItem('farmerId', farmerId);
                    }
                  }
                } catch (_) {}
              }
            }

            setSuccess('Login successful! Redirecting...');
            
            if (userRole === 'ADMIN') {
              setTimeout(() => navigate('/admin-dashboard'), 800);
            } else if (userRole === 'FARMER') {
              setTimeout(() => navigate('/farmer-dashboard'), 800);
            } else {
              setTimeout(() => navigate('/home'), 800);
            }
          } else {
            setError(data.message || 'Login failed. Please check your credentials.');
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          setError(errorData.message || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error('Login error:', err);
        if (err.message && err.message.includes('fetch')) {
          setError(`Cannot connect to backend API at ${API_BASE_URL}.`);
        } else {
          setError(`Could not connect to server: ${err.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in all fields');
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" color="#225c2b" fontWeight="bold" gutterBottom align="center">
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" paragraph>
            Sign in to continue to AgriZen
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handlePasswordLogin} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{ color: '#2E7D32' }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
