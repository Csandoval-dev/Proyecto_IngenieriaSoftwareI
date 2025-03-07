// clinic-admin.controller.js (nuevo archivo)

const db = require('../config/db');
const { getClinicById } = require('../models/clinic.model');

// Obtener la clínica asociada al administrador actual
const getMyClinic = async (req, res) => {
    try {
        // Obtenemos el id_clinica del usuario autenticado (disponible en req.user)
        const { id_clinica } = req.user;
        
        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }
        
        // Consultar la clínica específica
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
        // Obtenemos el id_clinica del usuario autenticado
        const { id_clinica } = req.user;
        
        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }
        
        // Consultar médicos de esa clínica específica
        const result = await db.query(`
            SELECT m.id_medico, m.nombre, e.nombre as especialidad, m.horario_disponibles
            FROM medico m
            JOIN especialidad e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_clinica = $1
        `, [id_clinica]);
        
        res.json(result.rows);
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
        
        // Insertar el nuevo médico asociado a esta clínica
        const result = await db.query(`
            INSERT INTO medico (nombre, id_especialidad, id_clinica, horario_disponibles)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [nombre, id_especialidad, id_clinica, horario_disponibles]);
        
        res.status(201).json({
            message: 'Médico agregado exitosamente',
            medico: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar médico', error: error.message });
    }
};

// Obtener citas de la clínica
const getClinicAppointments = async (req, res) => {
    try {
        const { id_clinica } = req.user;
        
        if (!id_clinica) {
            return res.status(403).json({ message: 'No tienes una clínica asignada' });
        }
        
        // Consultar citas de esa clínica específica
        const result = await db.query(`
            SELECT c.id_cita, c.fecha, c.hora, c.estado,
                   p.nombre as paciente, m.nombre as medico,
                   e.nombre as especialidad
            FROM cita c
            JOIN paciente p ON c.id_paciente = p.id_paciente
            JOIN medico m ON c.id_medico = m.id_medico
            JOIN especialidad e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_clinica = $1
            ORDER BY c.fecha DESC, c.hora ASC
        `, [id_clinica]);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo citas', error: error.message });
    }
};

module.exports = {
    getMyClinic,
    getClinicDoctors,
    addDoctor,
    getClinicAppointments
};