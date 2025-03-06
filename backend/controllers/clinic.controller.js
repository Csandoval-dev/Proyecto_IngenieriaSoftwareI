const { createClinic, updateClinicState } = require('../models/clinic.model');
const { createSubscription, updateSubscriptionState } = require('../models/subscription.model');

exports.registerClinic = async (req, res) => {
    try {
        const { nombre, tipo, direccion, telefono } = req.body;
        const estado = tipo === 'privada' ? 'pendiente' : 'aprobada';
        
        const nuevaClinica = await createClinic(nombre, tipo, direccion, telefono, estado);
        
        if (tipo === 'privada') {
            await createSubscription(nuevaClinica.id_clinica, 'pendiente');
        }
        
        res.status(201).json({ message: 'Clínica registrada exitosamente', clinica: nuevaClinica });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar clínica', error: error.message });
    }
};

exports.approveClinic = async (req, res) => {
    try {
        const { id_clinica } = req.params;
        
        const clinica = await updateClinicState(id_clinica, 'aprobada');
        
        if (!clinica) {
            return res.status(404).json({ message: 'Clínica no encontrada' });
        }
        
        await updateSubscriptionState(id_clinica, 'activa');
        
        res.json({ message: 'Clínica aprobada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar clínica', error: error.message });
    }
};