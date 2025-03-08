const db = require('../config/db');
const { createClinic, getClinicById, updateClinicEmail } = require('../models/clinic.model');
const { createSubscription } = require('../models/subscription.model');

exports.registerClinic = async (req, res) => {
    const client = await db.connect(); // Para manejar transacciones
    
    try {
        const { nombre, tipo, direccion, telefono, email } = req.body;
        
        // Iniciar transacción
        await client.query('BEGIN');
        
        // Verificar si ya existe una clínica con el mismo nombre o email
        const existingClinic = await client.query(
            'SELECT * FROM clinica WHERE nombre = $1 OR email = $2',
            [nombre, email]
        );
        
        if (existingClinic.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                message: 'Ya existe una clínica con este nombre o correo electrónico' 
            });
        }
        
        // Crear la clínica dentro de la transacción
        const clinicResult = await client.query(
            'INSERT INTO clinica (nombre, tipo, direccion, telefono, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, tipo, direccion, telefono, email]
        );
        const nuevaClinica = clinicResult.rows[0];
        
        // Crear una suscripción pendiente dentro de la misma transacción
        await client.query(
            'INSERT INTO suscripcion (id_clinica, estado, fecha_inicio) VALUES ($1, $2, $3)',
            [nuevaClinica.id_clinica, 'pendiente', new Date()]
        );
        
        // Confirmar la transacción
        await client.query('COMMIT');
        
        res.status(201).json({ 
            message: 'Clínica registrada exitosamente, pendiente de aprobación', 
            clinica: nuevaClinica 
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await client.query('ROLLBACK');
        console.error('Error al registrar clínica:', error);
        res.status(500).json({ message: 'Error al registrar clínica', error: error.message });
    } finally {
        client.release(); // Liberar el cliente
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