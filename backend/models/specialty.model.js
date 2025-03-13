const db = require('../config/db');

// Lista de especialidades predefinidas
const DEFAULT_SPECIALTIES = [
    'Cardiología',
    'Pediatría',
    'Dermatología',
    'Ginecología',
    'Oftalmología',
    'Ortopedia',
    'Neurología',
    'Psiquiatría',
    'Medicina General',
    'Odontología'
];

// Asegurar que todas las especialidades predefinidas existan
const ensureDefaultSpecialties = async () => {
    for (const specialty of DEFAULT_SPECIALTIES) {
        const exists = await db.query('SELECT * FROM especialidad WHERE nombre = $1', [specialty]);
        if (exists.rows.length === 0) {
            await db.query('INSERT INTO especialidad (nombre) VALUES ($1)', [specialty]);
            console.log(`Especialidad añadida: ${specialty}`);
        }
    }
};

const getAllSpecialties = async () => {
    await ensureDefaultSpecialties(); // Asegurar que todas las especialidades predefinidas existen
    const result = await db.query('SELECT * FROM especialidad ORDER BY nombre');
    return result.rows;
};

const getSpecialtyById = async (id_especialidad) => {
    const result = await db.query('SELECT * FROM especialidad WHERE id_especialidad = $1', [id_especialidad]);
    return result.rows[0];
};

// Dejamos este método por si alguna vez se necesita crear especialidades adicionales
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
    createSpecialty,
    ensureDefaultSpecialties
};