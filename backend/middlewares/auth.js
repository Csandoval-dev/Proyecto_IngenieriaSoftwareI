const jwt = require('jsonwebtoken');
require('dotenv').config();
const ADMIN_GENERAL_ROLE = 1; // Definimos los roles de los usuarios
const CLINIC_ADMIN_ROLE = 2;

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) { // Validar formato del token
        return res.status(401).json({ message: 'Acceso denegado' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

const isAdminGeneral = (req, res, next) => {
    if (req.user.rol !== ADMIN_GENERAL_ROLE) {
        return res.status(403).json({ message: 'Acceso restringido' });
    }
    next();
};

const isClinicAdmin = (req, res, next) => {
    if (req.user.rol !== CLINIC_ADMIN_ROLE) {
        return res.status(403).json({ message: 'Acceso restringido' });
    }
    next();
};

module.exports = { verifyToken, isAdminGeneral, isClinicAdmin };