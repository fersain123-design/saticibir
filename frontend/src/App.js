import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import MainLayout from './components/layout/MainLayout.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Products from './pages/Products.tsx';
import ProductsAdvanced from './pages/ProductsAdvanced.tsx';
import Orders from './pages/Orders.tsx';
import Campaigns from './pages/Campaigns.tsx';
import MultiChannel from './pages/MultiChannel.tsx';
import Payments from './pages/Payments.tsx';
import Analytics from './pages/Analytics.tsx';
import Reviews from './pages/Reviews.tsx';
import Messages from './pages/Messages.tsx';
import Help from './pages/Help.tsx';
import Profile from './pages/Profile.tsx';
import SmartInventory from './pages/SmartInventory.tsx';
import './App.css';

const PublicRoute = ({ children }) => {
  const { useAuth } = require('./context/AuthContext.tsx');
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="payments" element={<Payments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="messages" element={<Messages />} />
        <Route path="help" element={<Help />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
