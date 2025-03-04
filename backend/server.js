const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth.routes'); 
const db = require("./config/db"); // Import the database configuration
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

const clinicRoutes = require('./routes/clinic.routes');
app.use('/api', clinicRoutes);

app.use('/api/auth', authRoutes); // Usa authentication routes

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5002; // Puerto
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    
});
