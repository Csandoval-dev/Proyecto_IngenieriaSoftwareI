// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../Assets/Doctor1.jpg';

function Header() {
  const navigate = useNavigate();
  
  // Verificar si el usuario está autenticado (puedes adaptar esto a tu lógica de JWT)
  const isAuthenticated = localStorage.getItem('token') ? true : false;

  const handleServicesClick = () => {
    if (isAuthenticated) {
      navigate('/servicios-clinicos');
    } else {
      navigate('/login', { state: { from: '/servicios-clinicos' } });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Clínica Logo" />
          <h1>HealthConnect</h1>
        </Link>
      </div>
      
      <nav className={styles.navigation}>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to={isAuthenticated ? "/servicios" : "/login"}>Servicios</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
      
      <div className={styles.buttons}>
        <button 
          className={styles.serviceBtn} 
          onClick={handleServicesClick}
        >
          Servicios Clínicos
        </button>
        
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className={styles.loginBtn}>Iniciar Sesión</button>
            </Link>
            <Link to="/register">
              <button className={styles.registerBtn}>Registrarse</button>
            </Link>
          </>
        ) : (
          <button 
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;