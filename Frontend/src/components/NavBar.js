import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  InputBase,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Tooltip,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Home as HomeIcon,
  LocalFlorist as ProductsIcon,
  NewReleases as NewArrivalIcon,
  Park as SeedIcon,
  Info as AboutIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './SearchContext';
import { CartContext } from './CartContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)',
  boxShadow: '0 4px 20px rgba(27, 94, 32, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    transform: 'translateY(-2px)',
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
    background: 'rgba(255, 255, 255, 0.25)',
    transform: 'scale(1.15)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
  },
}));

const SearchBox = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: alpha(theme.palette.common.white, 0.95),
  borderRadius: 25,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: 300,
  border: `2px solid ${alpha('#2E7D32', 0.2)}`,
  boxShadow: '0 2px 12px rgba(46, 125, 50, 0.1)',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    borderColor: '#2E7D32',
    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)',
    transform: 'scale(1.02)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 160,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  flex: 1,
  color: theme.palette.text.primary,
  fontFamily: "'Inter', sans-serif",
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.9rem',
  },
}));

const getPages = () => {
  // Admin link removed - only accessible via direct /admin URL
  return [
    { name: 'Home', path: '/home' },
    { name: 'Products', path: '/products' },
    { name: 'New Arrival', path: '/new-arrival' },
    { name: 'Seeds & Saplings', path: '/seeds-saplings' },
    { name: 'About Us', path: '/about' },
  ];
};

function NavBar() {
  const navigate = useNavigate();
  const { cart } = React.useContext(CartContext);
  const { search, setSearch } = useContext(SearchContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [userName, setUserName] = React.useState(localStorage.getItem('name') || 'Guest');
  
  // Update username when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('name') || 'Guest');
    };
    window.addEventListener('storage', handleStorageChange);
    // Also check on mount and periodically
    const interval = setInterval(() => {
      const name = localStorage.getItem('name');
      if (name !== userName) {
        setUserName(name || 'Guest');
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 72, py: 1 }}>
          {/* Modern Logo */}
          <Logo variant="h5" component="div" onClick={() => handleNavigation('/home')}>
            <img 
              src="https://img.icons8.com/ios-filled/50/ffffff/plant-under-sun.png" 
              alt="logo" 
              style={{height: 36, marginRight: 4}} 
            />
            AgriZen
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
              {getPages().map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => handleNavigation(page.path)}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {getPages().map((page) => (
              <NavButton
                key={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{ my: 2, display: 'block' }}
              >
                {page.name}
              </NavButton>
            ))}
          </Box>

          {/* Search Box */}
          <SearchBox>
            <SearchIcon sx={{ ml: 1.5, color: '#2E7D32' }} />
            <SearchInput
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />
          </SearchBox>

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

          {/* Cart and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCircle
              size="large"
              aria-label="cart"
              onClick={() => handleNavigation('/cart')}
            >
              <Badge badgeContent={cart.length} color="error">
                <CartIcon />
              </Badge>
            </IconCircle>
            <IconCircle
              size="large"
              aria-label="profile"
              onClick={() => setProfileOpen(true)}
            >
              <AccountCircleIcon />
            </IconCircle>
          </Box>
        </Toolbar>
      </Container>
      <Dialog 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            fontFamily: "'Poppins', sans-serif",
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          Cart Items
        </DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <DialogContentText sx={{ fontFamily: "'Inter', sans-serif" }}>
              Your cart is empty.
            </DialogContentText>
          ) : (
            cart.map((item, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderBottom: '1px solid #eee', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  '&:hover': {
                    background: '#f5f5f5',
                  }
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>{item.name}</strong> — {item.price} {item.unit}
                </span>
                <Button 
                  size="small" 
                  color="error" 
                  onClick={() => { setCartOpen(false); navigate('/cart'); }}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Remove
                </Button>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCartOpen(false)} 
            sx={{ fontFamily: "'Inter', sans-serif" }}
          >
            Close
          </Button>
          {cart.length > 0 && (
            <Button 
              onClick={() => { setCartOpen(false); navigate('/payment'); }} 
              variant="contained"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                }
              }}
            >
              Proceed to Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
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
          User Profile
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 60, color: '#2E7D32', mb: 1 }} />
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              {localStorage.getItem('name') || 'Guest User'}
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
              <strong>Role:</strong> {localStorage.getItem('role') || 'Guest'}
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
              try {
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                localStorage.removeItem('name');
                localStorage.removeItem('email');
                localStorage.removeItem('farmerId');
              } catch (e) {}
              setProfileOpen(false);
              navigate('/login');
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

export default NavBar;
