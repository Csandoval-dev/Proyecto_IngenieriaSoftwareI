const db = require('../config/db');

const createClinic = async (nombre, tipo, direccion, telefono, estado) => {
    const result = await db.query(
        'INSERT INTO clinica (nombre, tipo, direccion, telefono, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, tipo, direccion, telefono, estado]
    );
    return result.rows[0];
};

const updateClinicState = async (id_clinica, estado) => {
    const result = await db.query(
        'UPDATE clinica SET estado = $1 WHERE id_clinica = $2 RETURNING *',
        [estado, id_clinica]
    );
    return result.rows[0];
};

module.exports = {
    createClinic,
    updateClinicState
};