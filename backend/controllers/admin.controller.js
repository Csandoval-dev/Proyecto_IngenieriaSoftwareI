// admin.controller.js

const db = require('../config/db');
const { sendAdminCredentials, sendRejectionNotification } = require('../Services/email.services');
const { getClinicById, updateClinicEmail, updateClinicStatus } = require('../models/clinic.model');
const { getSubscriptionByClinicId, updateSubscriptionState, deleteSubscription } = require('../models/subscription.model');
const { createUser, getUsersByRole } = require('../models/user.model');

// Función para obtener todas las clínicas con su estado
const getAllClinics = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, s.estado 
            FROM clinica c
            LEFT JOIN suscripcion s ON c.id_clinica = s.id_clinica
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las clínicas', error: error.message });
    }
};

// Función para obtener todos los administradores de clínicas
const getAllClinicAdmins = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM usuario WHERE id_rol = 2');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo administradores de clínica', error: error.message });
    }
};

// Función para obtener clínicas pendientes
const getPendingClinics = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*, s.estado, s.id_suscripcion
            FROM clinica c
            JOIN suscripcion s ON c.id_clinica = s.id_clinica
            WHERE s.estado = $1
        `, ['pendiente']);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo las clínicas pendientes', error: error.message });
    }
};

// Función para aprobar clínicas
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
        
        await updateSubscriptionState(suscripcion.id_suscripcion, 'activa');
        
        // Generar un nombre de usuario basado en el nombre de la clínica
        const username = clinica.nombre.toLowerCase().replace(/\s+/g, '.') + '@admin';
        const password = Math.random().toString(36).substring(2, 10); // Contraseña aleatoria
        
        // Crear usuario administrador para la clínica
        const nuevoUsuario = await createUser({
            nombre: `Admin ${clinica.nombre}`,
            email: clinica.email || username + '@example.com',
            contraseña: password,
            id_rol: 2 // Rol para administradores de clínica
        });
        
        // Si la clínica no tiene email, actualizar con el email generado
        if (!clinica.email) {
            await updateClinicEmail(id_clinica, nuevoUsuario.email);
        }
        
        // Enviar correo con las credenciales
        let emailSent = false;
        try {
            await sendAdminCredentials(
                clinica.nombre,
                nuevoUsuario.email,
                password
            );
            emailSent = true;
        } catch (emailError) {
            console.error('Error enviando email:', emailError);
        }
        
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

// Nueva función para rechazar clínicas
const rejectClinic = async (req, res) => {
    const { id_clinica } = req.params;
    const { reason } = req.body; // Razón opcional del rechazo
    
    try {
        // Verificar si la clínica existe
        const clinica = await getClinicById(id_clinica);
        if (!clinica) {
            return res.status(404).json({ message: 'Clínica no encontrada' });
        }
        
        // Obtener la suscripción
        const suscripcion = await getSubscriptionByClinicId(id_clinica);
        if (!suscripcion) {
            return res.status(404).json({ message: 'Suscripción no encontrada para esta clínica' });
        }
        
        // Actualizar el estado de la suscripción a 'rechazada'
        await updateSubscriptionState(suscripcion.id_suscripcion, 'rechazada');
        
        // Enviar correo de notificación si hay un email registrado
        let emailSent = false;
        if (clinica.email) {
            try {
                await sendRejectionNotification(
                    clinica.nombre,
                    clinica.email,
                    reason || 'No cumple con los requisitos necesarios'
                );
                emailSent = true;
            } catch (emailError) {
                console.error('Error enviando email de rechazo:', emailError);
            }
        }
        
        res.json({
            message: `Clínica rechazada correctamente.${emailSent ? ' Notificación enviada por correo.' : ' No se pudo enviar notificación por correo.'}`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al rechazar clínica', error: error.message });
    }
};

// Función para obtener usuarios por rol
const getUsersByRoleId = async (req, res) => {
    const { id_rol } = req.params;
    
    try {
        const usuarios = await getUsersByRole(id_rol);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo usuarios por rol', error: error.message });
    }
};

// Función para obtener todos los usuarios con su información de rol
const getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.id_usuario, u.nombre, u.email, r.nombre as rol
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            ORDER BY r.id_rol, u.nombre
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo todos los usuarios', error: error.message });
    }
};

module.exports = { 
    getAllClinics, 
    getAllClinicAdmins, 
    getPendingClinics, 
    approveClinic,
    rejectClinic,
    getUsersByRoleId,
    getAllUsers
};
