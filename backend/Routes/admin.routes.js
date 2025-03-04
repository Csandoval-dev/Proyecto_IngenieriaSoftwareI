const express = require('express');
const { verifyToken, isAdminGeneral } = require('../middlewares/auth');
const { getAllClinics, getAllClinicAdmins } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/clinics', verifyToken, isAdminGeneral, getAllClinics);
router.get('/clinic-admins', verifyToken, isAdminGeneral, getAllClinicAdmins);

module.exports = router;
