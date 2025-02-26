const db = require('../config/db');

const findUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM Usuario WHERE email = $1', [email]);
    return result.rows[0];
};

const createUser = async (nombre, email, contraseñaEncriptada, id_rol) => {
    await db.query(
        'INSERT INTO Usuario (nombre, email, contraseña, id_rol) VALUES ($1, $2, $3, $4)',
        [nombre, email, contraseñaEncriptada, id_rol]
    );
};

module.exports = {
    findUserByEmail,
    createUser
};