// models/doctor.model.js
const db = require('../config/db');

const getDoctorsByClinic = async (id_clinica) => {
    const result = await db.query(`
        SELECT m.id_medico, m.nombre, e.nombre as especialidad, 
               e.id_especialidad, m.horario_disponibles
        FROM medico m
        JOIN especialidad e ON m.id_especialidad = e.id_especialidad
        WHERE m.id_clinica = $1
    `, [id_clinica]);
    return result.rows;
};

const getDoctorById = async (id_medico) => {
    const result = await db.query(`
        SELECT m.id_medico, m.nombre, m.id_especialidad, 
               e.nombre as especialidad, m.horario_disponibles, m.id_clinica
        FROM medico m
        JOIN especialidad e ON m.id_especialidad = e.id_especialidad
        WHERE m.id_medico = $1
    `, [id_medico]);
    return result.rows[0];
};

const createDoctor = async (nombre, id_especialidad, id_clinica, horario_disponibles) => {
    const result = await db.query(`
        INSERT INTO medico (nombre, id_especialidad, id_clinica, horario_disponibles)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [nombre, id_especialidad, id_clinica, horario_disponibles]);
    return result.rows[0];
};

const updateDoctor = async (id_medico, nombre, id_especialidad, horario_disponibles) => {
    const result = await db.query(`
        UPDATE medico 
        SET nombre = $1, id_especialidad = $2, horario_disponibles = $3
        WHERE id_medico = $4
        RETURNING *
    `, [nombre, id_especialidad, horario_disponibles, id_medico]);
    return result.rows[0];
};

const deleteDoctor = async (id_medico) => {
    await db.query('DELETE FROM medico WHERE id_medico = $1', [id_medico]);
    return true;
};

const checkDoctorBelongsToClinic = async (id_medico, id_clinica) => {
    const result = await db.query(
        'SELECT * FROM medico WHERE id_medico = $1 AND id_clinica = $2',
        [id_medico, id_clinica]
    );
    return result.rows.length > 0;
};

const checkDoctorHasPendingAppointments = async (id_medico) => {
    const result = await db.query(
        'SELECT COUNT(*) FROM cita WHERE id_medico = $1 AND estado = $2',
        [id_medico, 'PENDIENTE']
    );
    return parseInt(result.rows[0].count) > 0;
};

module.exports = {
    getDoctorsByClinic,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    checkDoctorBelongsToClinic,
    checkDoctorHasPendingAppointments
};