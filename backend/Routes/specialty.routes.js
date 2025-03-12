const express = require('express');
const { getSpecialties, addSpecialty } = require('../controllers/specialty.controller');
const { authenticateJWT, isClinicAdmin } = require('../middlewares/auth'); // Cambiar la ruta aquí

const router = express.Router();

// Ruta pública para obtener especialidades
router.get('/', getSpecialties);

// Ruta para crear especialidades (solo admin de clínica)
router.post('/', authenticateJWT, isClinicAdmin, addSpecialty);

module.exports = router;