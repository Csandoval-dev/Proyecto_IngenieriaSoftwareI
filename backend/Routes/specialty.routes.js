const express = require('express');
const { getSpecialties, addSpecialty } = require('../controllers/specialty.controller');
const { verifyToken, isClinicAdmin } = require('../middlewares/auth');

const router = express.Router();

// Ruta pública para obtener especialidades
router.get('/', getSpecialties);

// Ruta para crear especialidades (solo admin de clínica)
router.post('/', verifyToken, isClinicAdmin, addSpecialty);

module.exports = router;