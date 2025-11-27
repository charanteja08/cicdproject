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
  Grid,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'Farmer',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (Object.values(formData).every(value => value)) {
      // Prepare data for backend
      const payload = {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.phone,
        role: formData.role === 'Farmer' ? 'FARMER' : 'BUYER'
      };
      try {
        // Register in common auth users table
        const authRes = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (authRes.ok) {
          const auth = await authRes.json();
          // Store user information
          localStorage.setItem('userId', String(auth.userId));
          localStorage.setItem('role', auth.role);
          localStorage.setItem('name', auth.name || payload.name);
          localStorage.setItem('email', auth.email || payload.email);
          
          // If role is Farmer, ensure Farmer record exists and store farmerId
          if (payload.role === 'FARMER') {
            // try to fetch by email first
            const byEmail = await fetch(`${API_BASE_URL}/farmers/by-email?email=${encodeURIComponent(payload.email)}`);
            if (byEmail.ok) {
              const f = await byEmail.json();
              localStorage.setItem('farmerId', f.id);
            } else {
              const createRes = await fetch(`${API_BASE_URL}/farmers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: payload.name, email: payload.email })
              });
              if (createRes.ok) {
                const f = await createRes.json();
                localStorage.setItem('farmerId', f.id);
              }
            }
          }
          setSuccess('Registration successful! Please login.');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          try {
            const err = await authRes.json();
            setError(err?.message || 'Registration failed. Please try again.');
          } catch (_) {
            setError('Registration failed. Please try again.');
          }
        }
      } catch (err) {
        setError('Could not connect to server.');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" color="#225c2b" fontWeight="bold" gutterBottom align="center">
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" paragraph>
            Join AgriZen and start shopping for agricultural products
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

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Mobile Number"
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  helperText="Include country code (e.g., +1234567890)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="Farmer">Farmer</MenuItem>
                  <MenuItem value="Buyer">Buyer</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ color: '#2E7D32' }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage; 