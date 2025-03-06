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

const getPendingClinics = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clinica WHERE estado = $1', ['pendiente']);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las clínicas pendientes' });
    }
};

const approveClinic = async (req, res) => {
    const { id_clinica } = req.params;
    try {
        // Actualizar el estado de la clínica a 'activa'
        await db.query('UPDATE clinica SET estado = $1 WHERE id_clinica = $2', ['activa', id_clinica]);
        
        // Actualizar el estado de la suscripción a 'activa'
        await db.query('UPDATE suscripcion SET estado = $1 WHERE id_clinica = $2', ['activa', id_clinica]);
        
        res.json({ message: 'Clínica aprobada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error aprobando la clínica' });
    }
};

module.exports = { getAllClinics, getAllClinicAdmins, getPendingClinics, approveClinic };