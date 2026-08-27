import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Crops from './pages/Crops';
import SoilHealth from './pages/SoilHealth';
import WeatherAndPests from './pages/WeatherAndPests';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Forum from './pages/Forum';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/weather-pests" element={<WeatherAndPests />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/forum" element={<Forum />} />

                  {/* Authenticated Farmer Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/farms" element={<Farms />} />
                    <Route path="/crops" element={<Crops />} />
                    <Route path="/soil-health" element={<SoilHealth />} />
                    <Route path="/orders" element={<Orders />} />
                  </Route>

                  {/* Admin Only Route */}
                  <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
