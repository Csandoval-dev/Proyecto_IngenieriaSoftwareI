// routes/clinic-admin.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken, isClinicAdmin } = require('../middleware/auth.middleware');
const clinicAdminController = require('../controllers/clinic-admin.controller');

// Todas las rutas de administrador de clínica requieren autenticación y rol específico
router.use(verifyToken, isClinicAdmin);

// Rutas para administrador de clínica
router.get('/my-clinic', clinicAdminController.getMyClinic);
router.get('/doctors', clinicAdminController.getClinicDoctors);
router.post('/doctors', clinicAdminController.addDoctor);
router.get('/appointments', clinicAdminController.getClinicAppointments);

module.exports = router;