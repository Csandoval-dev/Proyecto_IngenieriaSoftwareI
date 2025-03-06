const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

const isAdminGeneral = (req, res, next) => {
    if (req.user.rol !== 1) { // Asegúrate que el ID de rol del admin general es 1
        return res.status(403).json({ message: 'Acceso restringido' });
    }
    next();
};

const isClinicAdmin = (req, res, next) => {
    if (req.user.rol !== 2) { // Asegúrate que el ID de rol del admin de clínica es 2
        return res.status(403).json({ message: 'Acceso restringido' });
    }
    next();
};

module.exports = { verifyToken, isAdminGeneral, isClinicAdmin };
