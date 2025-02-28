// src/components/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';
import logo from '../Assets/Doctor2.jpg';

function Footer() {
  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <img src={logo} alt="Clínica Logo" />
          <h3>MediSalud</h3>
        </div>
        
        <div className={styles.footerLinks}>
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#especialidades">Especialidades</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        
        <div className={styles.footerContact}>
          <h4>Contacto</h4>
          <p>Av. Principal #123, Ciudad</p>
          <p>Email: info@medisalud.com</p>
          <p>Teléfono: (123) 456-7890</p>
        </div>
        
        <div className={styles.footerNewsletter}>
          <h4>Suscríbete a nuestro boletín</h4>
          <p>Recibe información sobre promociones y consejos de salud.</p>
          <div className={styles.newsletterForm}>
            <input type="email" placeholder="Tu correo electrónico" />
            <button>Suscribirse</button>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; 2025 MediSalud. Todos los derechos reservados.</p>
        <div className={styles.socialLinks}>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;