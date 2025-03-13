import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import HomePage from './pages/Home';
import RegisterPage from './pages/Register';
import ServiciosClinicosPage from './components/ServicesPreview';
import AdminDashboard from './components/AdminDashboard';
import ClinicAdminDashboard from './components/ClinicAdminDashboard';
import RegisterClinic from './components/RegisterClinic';
import Header from './components/Header';

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

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (isAuthenticated && restricted) {
        if (userRole === '1') {
            return <Navigate to="/admin-dashboard" />;
        } else if (userRole === '2') {
            return <Navigate to="/clinic-admin-dashboard" />;
        } else if (userRole === '3') {
            return <Navigate to="/servicios-clinicos" />;
        }
    }

    return <Component {...rest} />;
};

function App() {
    return (
        <Router>
            <Header />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<PublicRoute component={LoginPage} restricted />} />
                    <Route path="/register" element={<PublicRoute component={RegisterPage} restricted />} />
                    <Route path="/register-clinic" element={<PublicRoute component={RegisterClinic} restricted />} />
                    <Route path="/servicios-clinicos" element={<PrivateRoute component={ServiciosClinicosPage} />} />
                    <Route path="/admin-dashboard" element={<PrivateRoute component={AdminDashboard} requiredRole="1" />} />
                    <Route path="/clinic-admin-dashboard" element={<PrivateRoute component={ClinicAdminDashboard} requiredRole="2" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;