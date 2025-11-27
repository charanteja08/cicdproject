import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Info as InfoIcon,
  Lightbulb as TipsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)',
  boxShadow: '0 4px 20px rgba(27, 94, 32, 0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginRight: theme.spacing(4),
  letterSpacing: 1.5,
  fontSize: 28,
  color: '#fff',
  textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: '0 4px',
  fontWeight: 600,
  letterSpacing: 0.5,
  borderRadius: 8,
  padding: '8px 20px',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '0.95rem',
  textTransform: 'none',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 3,
    background: 'linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    '&::after': {
      width: '80%',
    },
  },
  '&.active': {
    '&::after': {
      width: '80%',
    },
  },
}));

const IconCircle = styled(IconButton)(({ theme }) => ({
  color: 'white',
  background: 'rgba(255, 255, 255, 0.1)',
  margin: '0 4px',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
  },
}));

const getFarmerPages = () => {
  return [
    { name: 'Dashboard', path: '/farmer-dashboard', icon: <DashboardIcon /> },
    { name: 'About Farming', path: '/farmer/about-farming', icon: <InfoIcon /> },
    { name: 'Farming Tips', path: '/farmer/farming-tips', icon: <TipsIcon /> },
  ];
};

function FarmerNavBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [userName, setUserName] = React.useState(localStorage.getItem('name') || 'Farmer');
  
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('name') || 'Farmer');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const name = localStorage.getItem('name');
      if (name !== userName) {
        setUserName(name || 'Farmer');
      }
    }, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userName]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('farmerId');
    } catch (e) {}
    navigate('/login');
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 72, py: 1 }}>
          <Logo variant="h5" component="div" onClick={() => handleNavigation('/farmer-dashboard')}>
            <img 
              src="https://img.icons8.com/ios-filled/50/ffffff/plant-under-sun.png" 
              alt="logo" 
              style={{height: 36, marginRight: 4}} 
            />
            AgriZen Farmer
          </Logo>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  mt: 1,
                },
              }}
            >
              {getFarmerPages().map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => handleNavigation(page.path)}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {page.icon}
                    <Typography textAlign="center">{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {getFarmerPages().map((page) => (
              <NavButton
                key={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{ my: 2, display: 'block' }}
              >
                {page.name}
              </NavButton>
            ))}
          </Box>

          {/* User Greeting */}
          <Typography 
            sx={{ 
              color: '#fff', 
              fontWeight: 500, 
              mx: 2, 
              display: { xs: 'none', lg: 'block' },
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Hi, {userName}!
          </Typography>

          {/* Profile and Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCircle
              size="large"
              aria-label="profile"
              onClick={() => setProfileOpen(true)}
            >
              <AccountCircleIcon />
            </IconCircle>
            <IconCircle
              size="large"
              aria-label="logout"
              onClick={handleLogout}
              title="Logout"
            >
              <LogoutIcon />
            </IconCircle>
          </Box>
        </Toolbar>
      </Container>

      {/* Profile Dialog */}
      <Dialog 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            fontFamily: "'Poppins', sans-serif",
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          Farmer Profile
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 60, color: '#2E7D32', mb: 1 }} />
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              {localStorage.getItem('name') || 'Farmer'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontFamily: "'Inter', sans-serif" }}
            >
              {localStorage.getItem('email') || 'No email'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography 
              variant="body2"
              sx={{ fontFamily: "'Inter', sans-serif" }}
            >
              <strong>Role:</strong> Farmer
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button 
            onClick={() => setProfileOpen(false)} 
            sx={{ fontFamily: "'Inter', sans-serif" }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setProfileOpen(false);
              handleLogout();
            }}
            variant="contained"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </StyledAppBar>
  );
}

export default FarmerNavBar;

