// clinic-admin.controller.js (versión actualizada)
const { getClinicById } = require('../models/clinic.model');
const { 
    getDoctorsByClinic, 
    createDoctor, 
    updateDoctor, 
    deleteDoctor,
    checkDoctorBelongsToClinic,
    checkDoctorHasPendingAppointments
} = require('../models/doctor.model');
const db = require('./config/db');

// Obtener la clínica asociada al administrador actual
const getMyClinic = async (req, res) => {
    try {
        const { id_clinica } = req.user;
        
        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }
        
        const clinica = await getClinicById(id_clinica);
        
        if (!clinica) {
            return res.status(404).json({ message: 'Clínica no encontrada' });
        }
        
        res.json(clinica);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo información de la clínica', error: error.message });
    }
};

// Obtener los médicos de la clínica asociada al administrador
const getClinicDoctors = async (req, res) => {
    try {
        const { id_clinica } = req.user;
        
        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }
        
        const doctors = await getDoctorsByClinic(id_clinica);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo médicos', error: error.message });
    }
};

// Agregar un médico a la clínica
const addDoctor = async (req, res) => {
    const { nombre, id_especialidad, horario_disponibles } = req.body;
    const { id_clinica } = req.user;
    
    try {
        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }
        
        const medico = await createDoctor(nombre, id_especialidad, id_clinica, horario_disponibles);
        
        res.status(201).json({
            message: 'Médico agregado exitosamente',
            medico
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar médico', error: error.message });
    }
};

// Actualizar información de un médico
const updateDoctorInfo = async (req, res) => {
    const { id_medico } = req.params;
    const { nombre, id_especialidad, horario_disponibles } = req.body;
    const { id_clinica } = req.user;
    
    try {
        // Verificar que el médico pertenezca a esta clínica
        const belongsToClinic = await checkDoctorBelongsToClinic(id_medico, id_clinica);
        
        if (!belongsToClinic) {
            return res.status(403).json({ message: 'No tienes permiso para editar este médico' });
        }
        
        // Actualizar el médico
        const medico = await updateDoctor(id_medico, nombre, id_especialidad, horario_disponibles);
        
        res.json({
            message: 'Médico actualizado exitosamente',
            medico
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar médico', error: error.message });
    }
};

// Eliminar un médico
const removeDoctorFromClinic = async (req, res) => {
    const { id_medico } = req.params;
    const { id_clinica } = req.user;
    
    try {
        // Verificar que el médico pertenezca a esta clínica
        const belongsToClinic = await checkDoctorBelongsToClinic(id_medico, id_clinica);
        
        if (!belongsToClinic) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este médico' });
        }
        
        // Verificar si el médico tiene citas pendientes
        const hasPendingAppointments = await checkDoctorHasPendingAppointments(id_medico);
        
        if (hasPendingAppointments) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el médico porque tiene citas pendientes' 
            });
        }
        
        // Eliminar el médico
        await deleteDoctor(id_medico);
        
        res.json({ message: 'Médico eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar médico', error: error.message });
    }
};

// Obtener citas de la clínica
const getClinicAppointments = async (req, res) => {
    try {
        const { id_clinica } = req.user;

        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }

        const result = await db.query(`
            SELECT c.id_cita, c.fecha, c.hora, c.estado,
                   u.nombre as paciente, m.nombre as medico,
                   e.nombre as especialidad
            FROM cita c
            JOIN usuario u ON c.id_paciente = u.id_usuario
            JOIN medico m ON c.id_medico = m.id_medico
            JOIN especialidad e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_clinica = $1
            ORDER BY c.fecha DESC, c.hora ASC
        `, [id_clinica]);

        res.json(result.rows);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ message: 'Error de conexión a la base de datos', error: error.message });
        }
        res.status(500).json({ message: 'Error obteniendo citas', error: error.message });
    }
};
module.exports = {
    getMyClinic,
    getClinicDoctors,
    addDoctor,
    updateDoctorInfo,
    removeDoctorFromClinic,
    getClinicAppointments
};