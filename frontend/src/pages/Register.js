import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../components/Register.module.css';
import registerImage from '../Assets/Registro.jpg';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const Register = () => {
    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    // Estados para el manejo de UI
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // Para un registro de múltiples pasos
    
    const navigate = useNavigate();

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Limpiar errores al escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Validar el formulario
    const validateForm = () => {
        const newErrors = {};
        
        // Validar nombre
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }
        
        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        // Validar confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setIsLoading(true);
            
            await axios.post('http://localhost:5002/api/auth/register', {
                nombre: formData.name,
                email: formData.email,
                contraseña: formData.password,
                id_rol: 1
            });
            
            // Mostrar mensaje de éxito
            alert('¡Registro exitoso! Ahora puedes iniciar sesión');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.mensaje || 'Error al registrar usuario';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Cambiar al siguiente paso
    const handleNextStep = (e) => {
        e.preventDefault();
        
        // Validaciones específicas para el paso 1
        if (step === 1) {
            const stepErrors = {};
            
            if (!formData.name.trim()) {
                stepErrors.name = 'El nombre es obligatorio';
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email.trim()) {
                stepErrors.email = 'El email es obligatorio';
            } else if (!emailRegex.test(formData.email)) {
                stepErrors.email = 'Ingresa un email válido';
            }
            
            setErrors(stepErrors);
            
            if (Object.keys(stepErrors).length === 0) {
                setStep(2);
            }
        }
    };

    // Volver al paso anterior
    const handlePrevStep = () => {
        setStep(1);
    };

    // Navegar al login
    const handleLoginRedirect = () => {
        navigate('/login');
    };

    // Renderizar paso 1 (información personal)
    const renderStep1 = () => (
        <>
            <h2 className={styles.title}>Crear Cuenta</h2>
            <p className={styles.subtitle}>Información personal</p>
            
            <div className={styles.inputGroup}>
                <FaUser className={styles.inputIcon} />
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                />
                {errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>
            
            <div className={styles.inputGroup}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
            </div>
            
            <button 
                type="button" 
                className={styles.button}
                onClick={handleNextStep}
            >
                Continuar
            </button>
        </>
    );

    // Renderizar paso 2 (credenciales)
    const renderStep2 = () => (
        <>
            <div className={styles.stepHeader}>
                <button 
                    type="button" 
                    className={styles.backButton}
                    onClick={handlePrevStep}
                >
                    <FaArrowLeft /> Volver
                </button>
                <h2 className={styles.title}>Seguridad</h2>
            </div>
            <p className={styles.subtitle}>Crea una contraseña segura</p>
            
            <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                />
                <button 
                    type="button" 
                    className={styles.visibilityToggle}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && <div className={styles.errorText}>{errors.password}</div>}
            </div>
            
            <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                />
                <button 
                    type="button" 
                    className={styles.visibilityToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
            </div>
            
            <div className={styles.passwordStrength}>
                <div className={formData.password.length > 0 ? 
                    (formData.password.length < 6 ? styles.weak : 
                     (formData.password.length < 10 ? styles.medium : styles.strong)) : 
                    ''}
                />
                <span className={styles.strengthText}>
                    {formData.password.length > 0 ? 
                        (formData.password.length < 6 ? 'Débil' : 
                         (formData.password.length < 10 ? 'Media' : 'Fuerte')) : 
                        'Introduce una contraseña'
                    }
                </span>
            </div>
            
            <button 
                type="submit" 
                className={styles.button}
                disabled={isLoading}
            >
                {isLoading ? 'Procesando...' : 'Completar registro'}
            </button>
        </>
    );

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src={registerImage} alt="Registro" className={styles.image}/>
                <div className={styles.overlay}>
                    <h1 className={styles.welcomeTitle}>Únete a nosotros</h1>
                    <p className={styles.welcomeText}>Crea tu cuenta en unos sencillos pasos</p>
                </div>
            </div>
            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.stepsIndicator}>
                        <div className={`${styles.step} ${step === 1 ? styles.activeStep : styles.completedStep}`}>1</div>
                        <div className={styles.stepConnector} />
                        <div className={`${styles.step} ${step === 2 ? styles.activeStep : (step > 2 ? styles.completedStep : '')}`}>2</div>
                    </div>
                    
                    {step === 1 ? renderStep1() : renderStep2()}
                    
                    <p className={styles.loginText}>
                        ¿Ya tienes una cuenta?{' '}
                        <button 
                            type="button" 
                            className={styles.loginButton} 
                            onClick={handleLoginRedirect}
                        >
                            Iniciar sesión
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;