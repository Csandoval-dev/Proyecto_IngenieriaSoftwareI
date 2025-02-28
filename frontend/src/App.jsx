import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import HomePage from './pages/Home';
import RegisterPage from './pages/Register';
import ServiciosClinicosPage from './components/ServicesPreview'; 

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
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
        <Route path="/servicios-clinicos" element={<PrivateRoute element={ServiciosClinicosPage} />} />
        {/*  agregar más rutas privadas s */}
      </Routes>
    </Router>
  );
}

export default App;