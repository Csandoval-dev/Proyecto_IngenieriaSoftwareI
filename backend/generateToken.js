const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, rol) => {
    const token = jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

// Generar un token para el administrador general (rol 1)
const token = generateToken(1, 1);
console.log('Generated Token:', token);