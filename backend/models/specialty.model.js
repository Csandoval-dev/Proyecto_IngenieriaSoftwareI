// models/specialty.model.js
const db = require('../config/db');

const getAllSpecialties = async () => {
    const result = await db.query('SELECT * FROM especialidad ORDER BY nombre');
    return result.rows;
};

const getSpecialtyById = async (id_especialidad) => {
    const result = await db.query('SELECT * FROM especialidad WHERE id_especialidad = $1', [id_especialidad]);
    return result.rows[0];
};

const createSpecialty = async (nombre) => {
    const result = await db.query(
        'INSERT INTO especialidad (nombre) VALUES ($1) RETURNING *',
        [nombre]
    );
    return result.rows[0];
};

module.exports = {
    getAllSpecialties,
    getSpecialtyById,
    createSpecialty
};