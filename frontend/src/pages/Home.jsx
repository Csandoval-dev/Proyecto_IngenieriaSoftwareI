import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import HeroSection from '../components/HeroSection';
import ServicesPreview from '../components/ServicesPreview';
import CarouselComponent from '../components/Carousel'; 

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  // Función para manejar los clics en botones de servicio
  const handleServiceClick = () => {
    if (isAuthenticated) {
      navigate('/servicios-clinicos');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.container}>
      <HeroSection onButtonClick={handleServiceClick} />
      <ServicesPreview onServiceClick={handleServiceClick} />
      <CarouselComponent />
    </div>
  );
}

export default HomePage;