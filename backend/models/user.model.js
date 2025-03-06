const db = require('../config/db');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado

const createUser = async (userData) => {
    const { nombre, email, contraseña, id_rol } = userData;
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    const result = await db.query(
        'INSERT INTO usuario (nombre, email, contraseña, id_rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre, email, id_rol',
        [nombre, email, hashedPassword, id_rol]
    );
    
    return result.rows[0];
};

const getUsersByRole = async (id_rol) => {
    const result = await db.query('SELECT id_usuario, nombre, email FROM usuario WHERE id_rol = $1', [id_rol]);
    return result.rows;
};

const findUserByUsername = async (username) => {
    const result = await db.query('SELECT * FROM usuario WHERE nombre = $1', [username]);
    return result.rows[0];
};

module.exports = { 
    createUser, 
    getUsersByRole, 
    findUserByUsername 
};