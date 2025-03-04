const db = require('../config/db');

const getAllClinics = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clinica');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las clínicas' });
    }
};

const getAllClinicAdmins = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM usuario WHERE id_rol = 2');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo administradores de clínica' });
    }
};

module.exports = { getAllClinics, getAllClinicAdmins };
