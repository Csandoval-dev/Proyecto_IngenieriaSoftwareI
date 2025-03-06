const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');

router.post('/register', clinicController.registerClinic);
router.put('/approve/:id_clinica', clinicController.approveClinic);

module.exports = router;