const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth.routes'); 
const adminRoutes = require('./routes/admin.routes');
const clinicRoutes = require('./routes/clinic.routes');
const db = require("./config/db"); // Import the database configuration
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/api/auth', authRoutes); // Usa authentication routes
app.use('/api/admin', adminRoutes); // Usa admin routes
app.use('/api/clinics', clinicRoutes); // Usa clinic routes

const PORT = process.env.PORT || 5002; // Puerto
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});