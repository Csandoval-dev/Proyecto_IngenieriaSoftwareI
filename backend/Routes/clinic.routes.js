// routes/clinic.routes.js
const express = require('express');
const { fetchClinics, fetchClinicAdmins } = require('../controllers/clinic.controller');

const router = express.Router();

router.get('/clinics', fetchClinics);
router.get('/clinic-admins', fetchClinicAdmins);

module.exports = router;