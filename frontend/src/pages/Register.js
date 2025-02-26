import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5002/api/auth/register', {
                nombre: name,
                email,
                contraseña: password,
                id_rol: 1 // Asigna un rol por defecto, ajusta según tu lógica
            });
            alert('Registro exitoso');
            navigate('/login');
        } catch (err) {
            alert('Error al registrar');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Registrar</button>
        </form>
    );
};

export default Register;