import React, { useEffect, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin status from localStorage
    const role = localStorage.getItem('role');
    const isAdminUser = role === 'ADMIN';
    setIsAdmin(isAdminUser);
    setLoading(false);
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminRoute;

