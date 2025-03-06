const { createClinic, getClinicById, updateClinicEmail } = require('../models/clinic.model');
const { createSubscription, updateSubscriptionState, getSubscriptionByClinicId } = require('../models/subscription.model');
const { createUser } = require('../models/user.model'); // Asumimos que existe este modelo

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

exports.approveClinic = async (req, res) => {
    try {
        const { id_clinica } = req.params;
        
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
        
        // Aquí irían las instrucciones para enviar un correo electrónico
        // con las credenciales al administrador de la clínica
        
        res.json({ 
            message: 'Clínica aprobada correctamente. Se ha creado un usuario administrador.',
            admin: {
                username: nuevoUsuario.email,
                password: password
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar clínica', error: error.message });
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