import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { SearchProvider } from './components/SearchContext';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import NewArrivalPage from './components/NewArrivalPage';
import SeedsSaplingsPage from './components/SeedsSaplingsPage';
import CartPage from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import AboutPage from './components/AboutPage';
import FarmerDashboard from './components/FarmerDashboard';
import AboutFarming from './components/AboutFarming';
import FarmingTips from './components/FarmingTips';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminRoute from './components/AdminRoute';
import FarmerRoute from './components/FarmerRoute';
import BuyerRoute from './components/BuyerRoute';

function App() {
  return (
    <SearchProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Buyer routes - protected from farmers */}
            <Route path="/home" element={<BuyerRoute><HomePage /></BuyerRoute>} />
            <Route path="/products" element={<BuyerRoute><ProductsPage /></BuyerRoute>} />
            <Route path="/new-arrival" element={<BuyerRoute><NewArrivalPage /></BuyerRoute>} />
            <Route path="/seeds-saplings" element={<BuyerRoute><SeedsSaplingsPage /></BuyerRoute>} />
            <Route path="/cart" element={<BuyerRoute><CartPage /></BuyerRoute>} />
            <Route path="/payment" element={<BuyerRoute><PaymentPage /></BuyerRoute>} />
            <Route path="/about" element={<BuyerRoute><AboutPage /></BuyerRoute>} />
            
            {/* Farmer routes - protected */}
            <Route path="/farmer" element={<FarmerRoute><FarmerDashboard farmerId={localStorage.getItem('farmerId')} /></FarmerRoute>} />
            <Route path="/farmer-dashboard" element={<FarmerRoute><FarmerDashboard farmerId={localStorage.getItem('farmerId')} /></FarmerRoute>} />
            <Route path="/farmer/about-farming" element={<FarmerRoute><AboutFarming /></FarmerRoute>} />
            <Route path="/farmer/farming-tips" element={<FarmerRoute><FarmingTips /></FarmerRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </CartProvider>
    </SearchProvider>
  );
}

export default App;
