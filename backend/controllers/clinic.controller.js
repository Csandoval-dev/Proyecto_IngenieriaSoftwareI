const { createClinic, getClinicById, updateClinicEmail } = require('../models/clinic.model');
const { createSubscription } = require('../models/subscription.model');

exports.registerClinic = async (req, res) => {
    try {
        const { nombre, tipo, direccion, telefono, email } = req.body;
        
        // Crear la clínica
        const nuevaClinica = await createClinic(nombre, tipo, direccion, telefono, email);
        
        // Crear una suscripción pendiente
        await createSubscription(nuevaClinica.id_clinica, 'pendiente');
        
        res.status(201).json({ 
            message: 'Clínica registrada exitosamente, pendiente de aprobación', 
            clinica: nuevaClinica 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar clínica', error: error.message });
    }
};

exports.getAllClinics = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, s.estado 
            FROM clinica c
            LEFT JOIN suscripcion s ON c.id_clinica = s.id_clinica
        `);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clínicas', error: error.message });
    }
};