// controllers/clinic.controller.js
const { getAllClinics, getAllClinicAdmins } = require('../models/clinic.model');

const fetchClinics = async (req, res) => {
    try {
        const clinics = await getAllClinics();
        res.json(clinics);
    } catch (error) {
        console.error('Error fetching clinics:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const fetchClinicAdmins = async (req, res) => {
    try {
        const admins = await getAllClinicAdmins();
        res.json(admins);
    } catch (error) {
        console.error('Error fetching clinic admins:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
module.exports = {
    fetchClinics,
    fetchClinicAdmins
};