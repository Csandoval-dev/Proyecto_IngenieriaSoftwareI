import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import HomePage from './pages/Home';
import RegisterPage from './pages/Register';
import ServiciosClinicosPage from './components/ServicesPreview';
import AdminDashboard from './components/AdminDashboard';

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas privadas que requieren autenticación */}
        <Route path="/servicios-clinicos" element={<PrivateRoute component={ServiciosClinicosPage} />} />
        <Route path="/admin-dashboard" element={<PrivateRoute component={AdminDashboard} requiredRole="1" />} />
      </Routes>
    </Router>
  );
}

export default App;