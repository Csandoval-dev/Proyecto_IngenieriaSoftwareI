// models/clinic.model.js
const db = require('../config/db');

const getAllClinics = async () => {
    const result = await db.query('SELECT * FROM clinica');
    return result.rows;
};

const getAllClinicAdmins = async () => {
    const result = await db.query('SELECT * FROM usuario WHERE id_rol = 2');
    return result.rows;
};

module.exports = {
    getAllClinics,
    getAllClinicAdmins
};