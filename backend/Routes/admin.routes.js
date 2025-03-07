const express = require('express');
const { verifyToken, isAdminGeneral } = require('../middlewares/auth');
const { 
    getAllClinics, 
    getAllClinicAdmins, 
    getPendingClinics, 
    approveClinic, 
    rejectClinic, 
    getUsersByRoleId,
    getAllUsers 
} = require('../controllers/admin.controller');

const router = express.Router();

router.get('/clinics', verifyToken, isAdminGeneral, getAllClinics);
router.get('/clinic-admins', verifyToken, isAdminGeneral, getAllClinicAdmins);
router.get('/pending-clinics', verifyToken, isAdminGeneral, getPendingClinics);
router.put('/approve-clinic/:id_clinica', verifyToken, isAdminGeneral, approveClinic);
router.put('/reject-clinic/:id_clinica', verifyToken, isAdminGeneral, rejectClinic);
router.get('/users/role/:id_rol', verifyToken, isAdminGeneral, getUsersByRoleId);
router.get('/users', verifyToken, isAdminGeneral, getAllUsers);

module.exports = router;