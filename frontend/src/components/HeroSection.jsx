import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';
import heroImage from '../Assets/Doctor3.jpg';

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
        <h2>Cuidando tu salud con excelencia</h2>
        <p>
          En MediSalud, nos dedicamos a brindarte la mejor atención médica con profesionales altamente calificados y tecnología de vanguardia. Tu bienestar es nuestra prioridad.
        </p>
        <div className={styles.cta}>
          <button className={styles.primaryBtn} onClick={handleAgendarCita}>
            Agendar Cita
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/nosotros')}>
            Conocer Más
          </button>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img src={heroImage} alt="Profesionales médicos" />
      </div>
    </section>
  );
}

export default HeroSection;