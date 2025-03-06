const db = require('../config/db');
const { sendAdminCredentials } = require('../Services/email.services');
const { getClinicById, updateClinicEmail } = require('../models/clinic.model');
const { getSubscriptionByClinicId, updateSubscriptionState } = require('../models/subscription.model');
const { createUser } = require('../models/user.model');

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
        const result = await db.query(`
            SELECT c.*, s.estado 
            FROM clinica c
            JOIN suscripcion s ON c.id_clinica = s.id_clinica
            WHERE s.estado = $1
        `, ['pendiente']);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las clínicas pendientes', error: error.message });
    }
};

const approveClinic = async (req, res) => {
    const { id_clinica } = req.params;
    try {
        // Verificar si la clínica existe
        const clinica = await getClinicById(id_clinica);
        if (!clinica) {
            return res.status(404).json({ message: 'Clínica no encontrada' });
        }
        
        // Actualizar el estado de la suscripción a 'activa'
        const suscripcion = await getSubscriptionByClinicId(id_clinica);
        if (!suscripcion) {
            return res.status(404).json({ message: 'Suscripción no encontrada para esta clínica' });
        }
        
        await updateSubscriptionState(id_clinica, 'activa');
        
        // Generar un nombre de usuario basado en el nombre de la clínica
        const username = clinica.nombre.toLowerCase().replace(/\s+/g, '.') + '@admin';
        const password = Math.random().toString(36).substring(2, 10); // Contraseña aleatoria
        
        // Crear usuario administrador para la clínica
        const nuevoUsuario = await createUser({
            nombre: `Admin ${clinica.nombre}`,
            email: clinica.email || username + '@example.com',
            contraseña: password,
            id_rol: 2 // Asumiendo que el rol 2 es para administradores
        });
        
        // Si la clínica no tiene email, actualizar con el email generado
        if (!clinica.email) {
            await updateClinicEmail(id_clinica, nuevoUsuario.email);
        }
        
        // Enviar correo con las credenciales
        const emailSent = await sendAdminCredentials(
            clinica.nombre,
            nuevoUsuario.email,
            password
        );
        
        res.json({ 
            message: `Clínica aprobada correctamente. Se ha creado un usuario administrador.${emailSent ? ' Correo enviado con credenciales.' : ' No se pudo enviar el correo con credenciales.'}`,
            admin: {
                username: nuevoUsuario.email,
                password: password
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar clínica', error: error.message });
    }
};

module.exports = { getAllClinics, getAllClinicAdmins, getPendingClinics, approveClinic };