import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './CarouselComponent.module.css';

import img1 from '../Assets/Clinica1.png';
import img2 from '../Assets/Clinica2.jpg';
import img3 from '../Assets/Clinica3.png';

function CarouselComponent() {
    const settings = {
        dots: false, 
        infinite: true,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768, // 📱 En pantallas pequeñas, mostrar 1 imagen
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 1024, // 💻 En tablets, mostrar 2 imágenes
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    };

    return (
        <div className={styles.carouselContainer}>
            <h2 className={styles.title}>Clínicas que confían en nuestros servicios</h2>
            <Slider {...settings} className={styles.carousel}>
                <div>
                    <img src={img1} alt="Clínica 1" className={styles.slideImage} />
                </div>
                <div>
                    <img src={img2} alt="Clínica 2" className={styles.slideImage} />
                </div>
                <div>
                    <img src={img3} alt="Clínica 3" className={styles.slideImage} />
                </div>
            </Slider>
        </div>
    );
}

export default CarouselComponent;
