const express = require('express');
const { verifyToken, isAdminGeneral } = require('../middlewares/auth');
const { getAllClinics, getAllClinicAdmins, getPendingClinics, approveClinic } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/clinics', verifyToken, isAdminGeneral, getAllClinics);
router.get('/clinic-admins', verifyToken, isAdminGeneral, getAllClinicAdmins);
router.get('/pending-clinics', verifyToken, isAdminGeneral, getPendingClinics);
router.put('/approve-clinic/:id_clinica', verifyToken, isAdminGeneral, approveClinic);

module.exports = router;