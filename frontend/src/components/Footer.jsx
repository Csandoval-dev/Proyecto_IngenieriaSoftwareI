import React from 'react';
import styles from './Footer.module.css';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from 'react-icons/fa';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerLogo}>
                    <h3>Mi Clínica</h3>
                </div>
                <div className={styles.footerLinks}>
                    <h4>Enlaces</h4>
                    <ul>
                        <li><a href="#home">Inicio</a></li>
                        <li><a href="#about">Sobre Nosotros</a></li>
                        <li><a href="#services">Servicios</a></li>
                        <li><a href="#contact">Contacto</a></li>
                    </ul>
                </div>
                <div className={styles.footerContact}>
                    <h4>Contacto</h4>
                    <p>Tel: +123 456 789</p>
                    <p>Email: info@miclinica.com</p>
                </div>
                <div className={styles.footerNewsletter}>
                    <h4>Newsletter</h4>
                    <p>Suscríbete a nuestro boletín</p>
                    <form className={styles.newsletterForm}>
                        <input type="email" placeholder="Tu correo" />
                        <button type="submit">Suscribirse</button>
                    </form>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; 2025 Mi Clínica. Todos los derechos reservados.</p>
                <div className={styles.socialLinks}>
                    <a href="#facebook"><FaFacebook /></a>
                    <a href="#instagram"><FaInstagram /></a>
                    <a href="#whatsapp"><FaWhatsapp /></a>
                    <a href="#twitter"><FaTwitter /></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;