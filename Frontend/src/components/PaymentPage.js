import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Container, Typography, List, ListItem, ListItemText, Divider, Button,
  TextField, Dialog, DialogContent, DialogActions, Card, CardContent,
  CircularProgress, Fade, Zoom, Grid, Stack, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QrCodeIcon from '@mui/icons-material/QrCode';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { GitHub, Instagram as InstagramIcon, LinkedIn as LinkedInIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { CartContext } from './CartContext';

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



// Place the attached QR image at `Frontend/public/images/razorpay-qr.png`.
// Use `process.env.PUBLIC_URL` so the path works when the app is served from a subpath.
const DUMMY_QR = process.env.PUBLIC_URL + '/images/razorpay-qr.jpg';



// UPI Logos URLs (using publicly available logos)
const UPI_LOGOS = [
  { name: 'Google Pay', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
  { name: 'PhonePe', url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
  { name: 'Paytm', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.png/512px-Paytm_logo.png' },
  
];

function generatePaymentId() {
  const ts = Date.now();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AGZ-${ts}-${rand}`;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [qrPaid, setQrPaid] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const total = cart.reduce((sum, item) => {
    let price = 0;
    if (typeof item.price === 'string') {
      price = parseFloat(item.price.replace('₹', '').replace(',', ''));
    } else {
      price = item.price;
    }
    return sum + (price * (item.quantity || 1));
  }, 0);

  // Countdown timer effect
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive, timer]);

  // Start timer when QR payment method is selected
  useEffect(() => {
    if (paymentMethod === 'qr' && !qrPaid) {
      setTimer(600);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [paymentMethod, qrPaid]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    if (paymentMethod === 'cod') {
      if (!form.name || !form.email) {
        setFormError('Please fill all required fields.');
        return;
      }
      setFormError('');
      const newPaymentId = generatePaymentId();
      setPaymentId(newPaymentId);
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
        await fetch(`${API_BASE_URL}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: newPaymentId,
            name: form.name,
            email: form.email,
            amount: total,
            method: paymentMethod
          })
        });
      } catch (err) {
        // Optionally handle error
      }
      setDialogOpen(true);
    } else {
      // QR Payment flow
      setIsVerifying(true);
      const newPaymentId = generatePaymentId();
      setPaymentId(newPaymentId);
      
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
        await fetch(`${API_BASE_URL}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: newPaymentId,
            name: form.name,
            email: form.email,
            amount: total,
            method: paymentMethod
          })
        });
      } catch (err) {
        // Optionally handle error
      }
      
      // Simulate verification delay
      setTimeout(() => {
        setIsVerifying(false);
        setShowSuccess(true);
        setIsTimerActive(false);
        setTimeout(() => {
          setQrPaid(true);
        }, 2000);
      }, 2000);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setShowSuccess(false);
    clearCart();
    setQrPaid(false);
    setIsVerifying(false);
    setPaymentMethod('cod');
    navigate('/home');
  };

  const SuccessDialog = ({ open, onClose, isQrPayment }) => (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.2)',
          overflow: 'hidden',
          border: '2px solid #A5D6A7'
        }
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center', bgcolor: '#f1f8f4' }}>
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <CheckCircleOutlineIcon 
            sx={{ 
              fontSize: 80, 
              color: '#2E7D32',
              mb: 2,
            }} 
          />
        </Zoom>
        <Fade in={true} style={{ transitionDelay: '200ms' }}>
          <Typography variant="h5" color="#2E7D32" fontWeight="bold" gutterBottom>
            Payment Received Successfully!
          </Typography>
        </Fade>
        <Fade in={true} style={{ transitionDelay: '300ms' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isQrPayment 
              ? "Your payment has been received successfully. Thank you for your purchase!"
              : "Your order has been placed successfully. Please keep the cash ready for delivery."}
          </Typography>
        </Fade>
        <Fade in={true} style={{ transitionDelay: '400ms' }}>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #A5D6A7' }}>
            <Typography variant="subtitle2" color="#2E7D32" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Items: {cart.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Amount: ₹{total}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Payment ID:</strong> {paymentId}
            </Typography>
          </Box>
        </Fade>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, bgcolor: '#f1f8f4' }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          fullWidth
          sx={{ 
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            bgcolor: '#2E7D32',
            '&:hover': {
              bgcolor: '#1B5E20',
            }
          }}
        >
          Continue Shopping
        </Button>
      </DialogActions>
    </Dialog>
  );

  const PaymentOptionCard = ({ value, icon, title, description, selected, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: selected ? '2px solid #2E7D32' : '2px solid #e0e0e0',
        bgcolor: selected ? '#A5D6A7' : 'white',
        boxShadow: selected ? '0 4px 20px rgba(46, 125, 50, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: selected ? '0 6px 24px rgba(46, 125, 50, 0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: selected ? '#2E7D32' : '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selected ? 'white' : '#2E7D32',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} color={selected ? '#2E7D32' : 'text.primary'}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
        {selected && (
          <CheckCircleOutlineIcon 
            sx={{ 
              color: '#2E7D32', 
              fontSize: 32,
              animation: 'pulse 1.5s ease infinite'
            }} 
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f1f8f4',
      backgroundImage: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%)',
      pb: 4
    }}>
      <NavBar />
      <Container maxWidth="sm" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 450,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(46, 125, 50, 0.15)',
            bgcolor: 'white',
            p: 3.75,
            border: '1px solid #A5D6A7',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              color="#2E7D32" 
              gutterBottom
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1 
              }}
            >
              🌱 Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review your cart and pay securely
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: '#A5D6A7' }} />

          {cart.length > 0 && (
            <List sx={{ mb: 2, bgcolor: '#f9f9f9', borderRadius: 2, p: 1 }}>
              {cart.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`${item.price} ${item.unit || ''} x ${item.quantity || 1}`} 
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ my: 2, borderColor: '#A5D6A7' }} />

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={700} color="#2E7D32">
              Total: ₹{total}
            </Typography>
          </Box>

          {cart.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="#2E7D32" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🌿 Select Payment Method
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <PaymentOptionCard
                  value="cod"
                  icon={<LocalShippingIcon />}
                  title="Cash on Delivery"
                  description="Pay when you receive"
                  selected={paymentMethod === 'cod'}
                  onClick={() => setPaymentMethod('cod')}
                />
                <PaymentOptionCard
                  value="qr"
                  icon={<QrCodeIcon />}
                  title="QR for UPI payment"
                  description="Scan and pay instantly"
                  selected={paymentMethod === 'qr'}
                  onClick={() => setPaymentMethod('qr')}
                />
              </Box>
            </Box>
          )}

          {paymentMethod === 'cod' && (
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Name" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#A5D6A7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2E7D32',
                    },
                  },
                }}
              />
              <TextField 
                label="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                fullWidth 
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#A5D6A7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2E7D32',
                    },
                  },
                }}
              />
              {formError && <Typography color="error">{formError}</Typography>}
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handlePay}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#2E7D32',
                  '&:hover': {
                    bgcolor: '#1B5E20',
                  },
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Pay Now
              </Button>
            </Box>
          )}

          {paymentMethod === 'qr' && !qrPaid && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={600} color="#2E7D32" mb={1}>
                Razorpay QR Code
              </Typography>
              
              {/* UPI Logos */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                {UPI_LOGOS.map((logo, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 0.5,
                    }}
                  >
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f9f9f9',
                  borderRadius: 2,
                  border: timer === 0 ? '2px solid #f44336' : '1px solid #A5D6A7',
                  mb: 2,
                  opacity: timer === 0 ? 0.6 : 1,
                }}
              >
                {!imageError ? (
                  <img 
                    src={DUMMY_QR} 
                    alt="Razorpay QR" 
                    onError={() => setImageError(true)}
                    style={{ 
                      width: 400, 
                      height: 300, 
                      display: 'block',
                      margin: '0 auto',
                      filter: timer === 0 ? 'grayscale(100%)' : 'none',
                      objectFit: 'contain',
                    }} 
                  />
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                    <BrokenImageIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      QR image not found.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Place `razorpay-qr.png` in `Frontend/public/images/` and reload the app.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Image URL: <strong>{DUMMY_QR}</strong>
                    </Typography>
                    <Button
                      component="a"
                      href={DUMMY_QR}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1, textTransform: 'none' }}
                      size="small"
                    >
                      Open image in new tab
                    </Button>
                  </Box>
                )}
              </Box>

              <Typography 
                variant="h6" 
                fontWeight={700} 
                color="#2E7D32" 
                mb={2}
                sx={{ fontSize: '1.3rem' }}
              >
                Amount to Pay: ₹{total}
              </Typography>

              {/* Timer */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2,
                  p: 1.5,
                  bgcolor: timer === 0 ? '#ffebee' : '#e8f5e9',
                  borderRadius: 2,
                  border: `1px solid ${timer === 0 ? '#f44336' : '#A5D6A7'}`,
                }}
              >
                <AccessTimeIcon sx={{ color: timer === 0 ? '#f44336' : '#2E7D32' }} />
                <Typography 
                  variant="body1" 
                  fontWeight={600}
                  color={timer === 0 ? '#f44336' : '#2E7D32'}
                >
                  QR valid for: {formatTime(timer)}
                </Typography>
              </Box>

              {/* Step-by-step instructions */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f1f8f4',
                  borderRadius: 2,
                  border: '1px solid #A5D6A7',
                  mb: 2,
                  textAlign: 'left',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} color="#2E7D32" mb={1.5}>
                  📋 Payment Instructions
                </Typography>
                {[
                  'Step 1: Open any UPI app',
                  'Step 2: Scan the QR code',
                  `Step 3: Enter amount (₹${total})`,
                  'Step 4: Complete payment',
                  'Step 5: Click "I HAVE PAID"'
                ].map((step, idx) => (
                  <Typography 
                    key={idx} 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 0.5, pl: 1 }}
                  >
                    {step}
                  </Typography>
                ))}
              </Box>

              {/* Success popup overlay */}
              {showSuccess && (
                <Fade in={showSuccess}>
                  <Box
                    sx={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 9999,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 3,
                        p: 4,
                        textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        border: '2px solid #2E7D32',
                      }}
                    >
                      <CheckCircleOutlineIcon 
                        sx={{ fontSize: 60, color: '#2E7D32', mb: 2 }} 
                      />
                      <Typography variant="h6" fontWeight={700} color="#2E7D32">
                        Payment Received Successfully!
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}

              <Button 
                variant="contained" 
                fullWidth
                onClick={handlePay}
                disabled={isVerifying || timer === 0}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: isVerifying ? '#1B5E20' : '#2E7D32',
                  '&:hover': {
                    bgcolor: '#1B5E20',
                  },
                  '&:disabled': {
                    bgcolor: '#9e9e9e',
                  },
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                {isVerifying ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    Verifying Payment…
                  </Box>
                ) : (
                  'I HAVE PAID'
                )}
              </Button>
            </Box>
          )}

          {paymentMethod === 'qr' && qrPaid && (
            <SuccessDialog 
              open={true} 
              onClose={handleDialogClose} 
              isQrPayment={true}
            />
          )}
        </Card>
      </Container>

      {dialogOpen && (
        <SuccessDialog 
          open={dialogOpen} 
          onClose={handleDialogClose} 
          isQrPayment={false}
        />
      )}

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
                    +91 98765 43210
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
                    123 Agriculture Street,<br />
                    Farm City, India 123456
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

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default PaymentPage;
