import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyPage } from './pages/PropertyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserDashboard } from './pages/UserDashboard';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { MyPropertiesPage } from './pages/MyPropertiesPage';
import { AddPropertyPage } from './pages/AddPropertyPage';
import { EditPropertyPage } from './pages/EditPropertyPage';
import { PropertyBookingsPage } from './pages/PropertyBookingsPage';

const AUTH_ROUTES = ['/login', '/register'];

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute requiredRole="user">
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Owner protected */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties"
              element={
                <ProtectedRoute requiredRole="owner">
                  <MyPropertiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties/add"
              element={
                <ProtectedRoute requiredRole="owner">
                  <AddPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties/edit/:id"
              element={
                <ProtectedRoute requiredRole="owner">
                  <EditPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties/:id/bookings"
              element={
                <ProtectedRoute requiredRole="owner">
                  <PropertyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/bookings"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
