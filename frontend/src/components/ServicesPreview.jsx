import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ServicesPreview.module.css';
import citasIcon from '../Assets/Citas.jpg';
import expedientesIcon from '../Assets/Expedientes.jpg';
import administracionIcon from '../Assets/Administracion.jpg';

function ServicesPreview() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleServiceClick = (serviceRoute) => {
    if (isAuthenticated) {
      navigate(`/gestion-clinica${serviceRoute}`);
    } else {
      navigate('/login', { state: { from: `/gestion-clinica${serviceRoute}` } });
    }
  };

  return (
    <section className={styles.services} id="servicios">
      <h2>Optimiza la Gestión de tu Clínica</h2>
      <p className={styles.servicesIntro}>
        Nuestra plataforma facilita la administración clínica con herramientas innovadoras para mejorar la eficiencia y calidad del servicio.
      </p>
      
      <div className={styles.servicesGrid}>
        <div className={styles.serviceCard}>
          <img src={citasIcon} alt="Gestión de Citas" />
          <h3>Gestión de Citas</h3>
          <p>Administra fácilmente la agenda de pacientes con recordatorios y confirmaciones automáticas.</p>
          <button onClick={() => handleServiceClick('/gestion-citas')}>Más Información</button>
        </div>
        
        <div className={styles.serviceCard}>
          <img src={expedientesIcon} alt="Expedientes Médicos Digitales" />
          <h3>Expedientes Médicos Digitales</h3>
          <p>Accede a historiales médicos de manera segura y en tiempo real.</p>
          <button onClick={() => handleServiceClick('/expedientes-medicos')}>Más Información</button>
        </div>
        
        <div className={styles.serviceCard}>
          <img src={administracionIcon} alt="Administración de Clínicas" />
          <h3>Administración de Clínicas</h3>
          <p>Optimiza recursos, gestiona personal y mejora la experiencia de los pacientes.</p>
          <button onClick={() => handleServiceClick('/administracion-clinica')}>Más Información</button>
        </div>
      </div>
      
      <div className={styles.servicesFooter}>
        <p>Transforma la manera en que manejas tu clínica con nuestras soluciones tecnológicas.</p>
        <button 
          className={styles.allServicesBtn}
          onClick={() => {
            if (isAuthenticated) {
              navigate('/gestion-clinica');
            } else {
              navigate('/login', { state: { from: '/gestion-clinica' } });
            }
          }}
        >
          Explorar Más Funcionalidades
        </button>
      </div>
    </section>
  );
}

export default ServicesPreview;