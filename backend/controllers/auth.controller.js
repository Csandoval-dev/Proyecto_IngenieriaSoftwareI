const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByUsername, findUserByEmail, createUser } = require('../models/user.model');
require('dotenv').config(); // Cargar variables de entorno

// Controlador para el Login
const login = async (req, res) => {
    const { username, contrasena } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await findUserByUsername(username);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const contrasenaCoincide = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaCoincide) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, rol: usuario.id_rol },
            process.env.JWT_SECRET, // Usar la clave secreta desde las variables de entorno
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            message: 'Login exitoso',
            user: {
                id: usuario.id_usuario,
                username: usuario.nombre,
                email: usuario.email,
                role: usuario.id_rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para el Registro
const register = async (req, res) => {
    const { nombre, email, contrasena, id_rol } = req.body;

    try {
        // Verificar si el email ya está registrado
        const usuarioExistente = await findUserByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10); // Generar un salt
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt); // Encriptar la contraseña

        // Insertar nuevo usuario con la contraseña encriptada
        await createUser(nombre, email, contrasenaEncriptada, id_rol);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    login,
    register
};