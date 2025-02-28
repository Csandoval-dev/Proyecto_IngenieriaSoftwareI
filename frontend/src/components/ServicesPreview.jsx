import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./ServicesPreview.module.css";
import consultaIcon from '../Assets/Doctor4.jpg';
import laboratorioIcon from '../Assets/Doctor5.jpg';
import especialidadesIcon from '../Assets/Doctor6.jpg';

function ServicesPreview() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleServiceClick = (serviceRoute) => {
    if (isAuthenticated) {
      navigate(`/servicios-clinicos${serviceRoute}`);
    } else {
      navigate('/login', { state: { from: `/servicios-clinicos${serviceRoute}` } });
    }
  };

  return (
    <section className={styles.services} id="servicios">
      <h2>Nuestros Servicios</h2>
      <p className={styles.servicesIntro}>
        Ofrecemos una amplia gama de servicios médicos para cuidar de tu salud en todas las etapas de tu vida.
      </p>
      
      <div className={styles.servicesGrid}>
        <div className={styles.serviceCard}>
          <img src={consultaIcon} alt="Consulta médica" />
          <h3>Consulta General</h3>
          <p>Atención médica de calidad para toda la familia con médicos especialistas.</p>
          <button onClick={() => handleServiceClick('/consulta-general')}>Ver más</button>
        </div>
        
        <div className={styles.serviceCard}>
          <img src={laboratorioIcon} alt="Laboratorio clínico" />
          <h3>Laboratorio Clínico</h3>
          <p>Análisis clínicos con la última tecnología y resultados en tiempo récord.</p>
          <button onClick={() => handleServiceClick('/laboratorio')}>Ver más</button>
        </div>
        
        <div className={styles.serviceCard}>
          <img src={especialidadesIcon} alt="Especialidades médicas" />
          <h3>Especialidades</h3>
          <p>Contamos con más de 20 especialidades para atender todas tus necesidades.</p>
          <button onClick={() => handleServiceClick('/especialidades')}>Ver más</button>
        </div>
      </div>
      
      <button 
        className={styles.allServicesBtn}
        onClick={() => {
          if (isAuthenticated) {
            navigate('/servicios-clinicos');
          } else {
            navigate('/login', { state: { from: '/servicios-clinicos' } });
          }
        }}
      >
        Ver todos los servicios
      </button>
    </section>
  );
}

export default ServicesPreview;