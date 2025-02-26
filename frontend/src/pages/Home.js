import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h1>Bienvenido al sistema de citas médicas</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default Home;
