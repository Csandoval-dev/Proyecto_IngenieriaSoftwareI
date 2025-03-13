const { getAllSpecialties, createSpecialty } = require('../models/specialty.model');

// Obtener todas las especialidades
const getSpecialties = async (req, res) => {
    try {
        const specialties = await getAllSpecialties();
        res.json(specialties);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo especialidades', error: error.message });
    }
};

// Crear una nueva especialidad (solo para uso administrativo avanzado)
const addSpecialty = async (req, res) => {
    const { nombre } = req.body;

    try {
        const specialty = await createSpecialty(nombre);

        res.status(201).json({
            message: 'Especialidad creada exitosamente',
            especialidad: specialty
        });
    } catch (error) {
        if (error.code === '23505') { // Código de PostgreSQL para violación de clave única
            return res.status(400).json({ message: 'Ya existe una especialidad con ese nombre' });
        } else if (error.code === '23502') { // Código de PostgreSQL para violación de valor no nulo
            return res.status(400).json({ message: 'El nombre de la especialidad es requerido' });
        }
        res.status(500).json({ message: 'Error al crear especialidad', error: error.message });
    }
};

module.exports = {
    getSpecialties,
    addSpecialty
};