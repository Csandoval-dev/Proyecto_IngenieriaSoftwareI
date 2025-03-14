const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth.routes'); 
const adminRoutes = require('./routes/admin.routes');
const clinicRoutes = require('./routes/clinic.routes');
const specialtyRoutes = require('./routes/specialty.routes');
const clinicAdminRoutes = require('./routes/clinic-admin.routes');
const db = require("./config/db"); // Import the database configuration
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
const chatbotRoutes = require('./routes/chatbotRoutes'); // Ensure this file exists
app.use('/api/chatbot', chatbotRoutes); // Ensure this route is correctly defined
app.use('/api/auth', authRoutes); // Usa authentication routes
app.use('/api/admin', adminRoutes); // Usa admin routes
app.use('/api/clinics', clinicRoutes); // Usa clinic routes
app.use('/api/specialties', specialtyRoutes); // Usa specialty routes
app.use('/api/clinic-admin', clinicAdminRoutes); // Usa clinic-admin routes


const { ensureDefaultSpecialties } = require('./models/specialty.model');

// Aseguraramos que las especialidades predefinidas existen al iniciar el servidor
ensureDefaultSpecialties().then(() => {
    console.log('✅ Especialidades predefinidas verificadas');
});

const PORT = process.env.PORT || 5002; // Puerto
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});