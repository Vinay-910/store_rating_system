import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import Register from './components/auth/RegisterForm';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import StoreOwnerDashboard from './components/dashboard/StoreOwnerDashboard';
import StoreList from './components/store/StoreList';
import StoreDetail from './components/store/StoreDetail';
import AdminUsers from './components/admin/AdminUsers';
import AdminStores from './components/admin/AdminStores';
import UserRatings from './components/user/UserRatings';
import Profile from './components/common/Profile';
import NotFound from './components/common/NotFound';
import Unauthorized from './components/common/Unauthorized';
import { USER_ROLES } from './utils/constants';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            
            {/* Normal User Routes */}
            <Route path="/stores" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.NORMAL_USER]}>
                <StoreList />
              </ProtectedRoute>
            } />
            <Route path="/my-ratings" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.NORMAL_USER]}>
                <UserRatings />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN]}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/stores" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.SYSTEM_ADMIN]}>
                <AdminStores />
              </ProtectedRoute>
            } />
            
            {/* Profile */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/stores/:id" element={
              <ProtectedRoute allowedRoles={[USER_ROLES.NORMAL_USER]}>
                <StoreDetail />
              </ProtectedRoute>
            } />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case USER_ROLES.SYSTEM_ADMIN:
      return <AdminDashboard />;
    case USER_ROLES.STORE_OWNER:
      return <StoreOwnerDashboard />;
    case USER_ROLES.NORMAL_USER:
      return <UserDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};


export default App;