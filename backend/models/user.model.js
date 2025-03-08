const db = require('../config/db');
const bcrypt = require('bcrypt');

// Versión actualizada que admite id_clinica y hasheado de contraseñas
const createUser = async (userData) => {
    // Si recibe un objeto, extrae los valores
    let nombre, email, contrasena, id_rol, id_clinica;
    
    if (typeof userData === 'object') {
        nombre = userData.nombre;
        email = userData.email;
        contrasena = userData.contraseña || userData.contrasena;
        id_rol = userData.id_rol;
        id_clinica = userData.id_clinica || null;
    } else {
        // Mantener compatibilidad con versión anterior
        [nombre, email, contrasena, id_rol] = arguments;
        id_clinica = arguments[4] || null;
    }
    
    // Validar que la contraseña sea una cadena antes de hashearla
    if (!contrasena || typeof contrasena !== 'string') {
        throw new TypeError('La contraseña debe ser una cadena de texto válida.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    const result = await db.query(
        'INSERT INTO usuario (nombre, email, contrasena, id_rol, id_clinica) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, email, hashedPassword, id_rol, id_clinica]
    );    
    return result.rows[0];
};

// Función para obtener usuarios por rol
const getUsersByRole = async (id_rol) => {
    const result = await db.query('SELECT * FROM usuario WHERE id_rol = $1', [id_rol]);
    return result.rows;
};

// Función para encontrar un usuario por email
const findUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return result.rows[0];
};

// Función para encontrar un usuario por nombre de usuario
const findUserByUsername = async (username) => {
    const result = await db.query('SELECT * FROM usuario WHERE nombre = $1', [username]);
    return result.rows[0];
};

// Función para obtener todos los usuarios
const getAllUsers = async () => {
    const result = await db.query('SELECT * FROM usuario');
    return result.rows;
};

// Nueva función para obtener usuarios por clínica
const getUsersByClinic = async (id_clinica) => {
    const result = await db.query('SELECT * FROM usuario WHERE id_clinica = $1', [id_clinica]);
    return result.rows;
};

// Nueva función para actualizar la clínica de un usuario
const updateUserClinic = async (id_usuario, id_clinica) => {
    const result = await db.query(
        'UPDATE usuario SET id_clinica = $1 WHERE id_usuario = $2 RETURNING *',
        [id_clinica, id_usuario]
    );
    return result.rows[0];
};

module.exports = { 
    createUser, 
    getUsersByRole, 
    findUserByEmail,
    findUserByUsername,
    getAllUsers,
    getUsersByClinic,
    updateUserClinic
};