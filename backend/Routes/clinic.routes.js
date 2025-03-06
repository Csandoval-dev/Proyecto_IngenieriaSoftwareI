const express = require('express');
const { registerClinic, getAllClinics } = require('../controllers/clinic.controller');
const { approveClinic } = require('../controllers/admin.controller'); // Asegúrate de importar la función approveClinic

const router = express.Router();

router.post('/register', registerClinic);
router.get('/', getAllClinics);
router.put('/approve-clinic/:id_clinica', approveClinic); // Asegúrate de que esta ruta esté correctamente definida

module.exports = router;