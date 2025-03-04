const db = require('../config/db');

const findUserByUsername = async (username) => {
    const result = await db.query('SELECT * FROM usuario WHERE nombre = $1', [username]);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return result.rows[0];
};

const createUser = async (nombre, email, contrasenaEncriptada, id_rol) => {
    await db.query(
        'INSERT INTO usuario (nombre, email, contrasena, id_rol) VALUES ($1, $2, $3, $4)',
        [nombre, email, contrasenaEncriptada, id_rol]
    );
};

module.exports = {
    findUserByUsername,
    findUserByEmail,
    createUser
};