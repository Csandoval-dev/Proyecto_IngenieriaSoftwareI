import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';
import heroImage from '../Assets/Doctor8.jpg';

function HeroSection({ onButtonClick }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleAgendarCita = () => {
    if (isAuthenticated) {
      navigate('/servicios-clinicos');
    } else {
      navigate('/login', { state: { from: '/servicios-clinicos' } });
    }
  };

  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h2>Gestión Médica Inteligente y Accesible</h2>
          <p>
            Conecta con los mejores especialistas y gestiona tus citas de manera rápida y eficiente.  
            En <strong>HealthConnect</strong>, ofrecemos una solución moderna para clínicas y pacientes, optimizando tiempos y mejorando la experiencia en el cuidado de la salud.
          </p>
          <div className={styles.cta}>
            <button className={styles.primaryBtn} onClick={handleAgendarCita}>
              Reserva tu Cita
            </button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/nosotros')}>
              Descubre Más
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={heroImage} alt="Atención médica profesional" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;