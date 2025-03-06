const db = require('../config/db');

const createClinic = async (nombre, tipo, direccion, telefono, email) => {
    const result = await db.query(
        'INSERT INTO clinica (nombre, tipo, direccion, telefono, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, tipo, direccion, telefono, email]
    );
    return result.rows[0];
};

const getClinicById = async (id_clinica) => {
    const result = await db.query('SELECT * FROM clinica WHERE id_clinica = $1', [id_clinica]);
    return result.rows[0];
};

const updateClinicEmail = async (id_clinica, email) => {
    const result = await db.query(
        'UPDATE clinica SET email = $1 WHERE id_clinica = $2 RETURNING *',
        [email, id_clinica]
    );
    return result.rows[0];
};

module.exports = { createClinic, getClinicById, updateClinicEmail };