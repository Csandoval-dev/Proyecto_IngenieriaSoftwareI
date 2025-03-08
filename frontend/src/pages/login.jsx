import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../components/Login.module.css';
import medicalImage from '../Assets/login.jpg';
import { 
    FaGoogle, 
    FaFacebook, 
    FaGithub, 
    FaLock, 
    FaUser, 
    FaEye, 
    FaEyeSlash, 
    FaChevronRight 
} from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [appear, setAppear] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/servicios-clinicos'; // Ruta de redirección por defecto

    useEffect(() => {
        setAppear(true);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await axios.post('http://localhost:5002/api/auth/login', {
                username: formData.username,
                contrasena: formData.password
            });

            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userRole', res.data.user.role);
                setAppear(false);
                setTimeout(() => {
                    if (res.data.user.role === 1) { // Asegúrate de que el rol sea un número
                        navigate('/admin-dashboard');
                    } else {
                        navigate(from);
                    }
                }, 300);
            } else {
                alert('Credenciales inválidas');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(`Inicio de sesión con ${provider} - Funcionalidad por implementar`);
        }, 800);
    };

    const handleRegisterRedirect = () => {
        setAppear(false);
        setTimeout(() => {
            navigate('/register');
        }, 300);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.imageContainer} ${appear ? styles.imageAppear : ''}`}>
                <img src={medicalImage} alt="Login" className={styles.image}/>
                <div className={styles.overlay}>
                    <h1 className={styles.welcomeTitle}>Bienvenido</h1>
                    <p className={styles.welcomeText}>Sistema de gestión médica</p>
                    <div className={styles.dots}>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                    </div>
                </div>
            </div>

            <div className={styles.formContainer}>
                <form 
                    className={`${styles.form} ${appear ? styles.formAppear : styles.formDisappear}`} 
                    onSubmit={handleSubmit}
                >
                    <div className={styles.logo}>
                        <div className={styles.logoInner}>
                            <FaUser />
                        </div>
                    </div>
                    
                    <h2 className={styles.title}>Iniciar Sesión</h2>
                    <p className={styles.subtitle}>Accede a tu cuenta para continuar</p>
                    
                    <div className={styles.inputGroup}>
                        <FaUser className={styles.inputIcon} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <FaLock className={styles.inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <button 
                            type="button" 
                            className={styles.visibilityToggle}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    <div className={styles.forgotPassword}>
                        <a href="#forgot">¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className={styles.loader}></div>
                        ) : (
                            <>
                                Iniciar Sesión
                                <FaChevronRight className={styles.buttonIcon} />
                            </>
                        )}
                    </button>

                    <div className={styles.divider}>
                        <span>O</span>
                    </div>

                    <div className={styles.socialLogin}>
                        <button 
                            type="button" 
                            className={`${styles.socialButton} ${styles.googleButton}`}
                            onClick={() => handleSocialLogin('Google')}
                        >
                            <FaGoogle className={styles.socialIcon} />
                        </button>
                        
                        <button 
                            type="button" 
                            className={`${styles.socialButton} ${styles.facebookButton}`}
                            onClick={() => handleSocialLogin('Facebook')}
                        >
                            <FaFacebook className={styles.socialIcon} />
                        </button>
                        
                        <button 
                            type="button" 
                            className={`${styles.socialButton} ${styles.githubButton}`}
                            onClick={() => handleSocialLogin('GitHub')}
                        >
                            <FaGithub className={styles.socialIcon} />
                        </button>
                    </div>
                    
                    <p className={styles.registerText}>
                        ¿No tienes cuenta?{' '}
                        <button 
                            type="button" 
                            className={styles.registerButton} 
                            onClick={handleRegisterRedirect}
                        >
                            Registrarse
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;