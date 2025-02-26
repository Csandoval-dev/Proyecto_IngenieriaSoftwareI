const express = require("express");
const cors = require("cors");
const authRoutes = require('.Routes/auth.routes');
const db = require("./config/db"); // Import the database configuration
require('dotenv').config(); // Cargar variables de entorno

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/api/auth', authRoutes); // Use authentication routes

const PORT = process.env.PORT || 5002; // Change the port to 5002
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});