// clinic-admin.routes.js
const express = require('express');
const { 
    getMyClinic, 
    getClinicDoctors, 
    addDoctor,
    updateDoctorInfo,
    removeDoctorFromClinic,
    getClinicAppointments
} = require('../controllers/clinic-admin.controller');
const { authenticateJWT } = require('./middlewares/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Rutas para el administrador de clínica
router.get('/my-clinic', getMyClinic);
router.get('/doctors', getClinicDoctors);
router.post('/doctors', addDoctor);
router.put('/doctors/:id_medico', updateDoctorInfo);
router.delete('/doctors/:id_medico', removeDoctorFromClinic);
router.get('/appointments', getClinicAppointments);

module.exports = router;