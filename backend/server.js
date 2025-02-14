const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();
app.use(cors()); // Permitir acceso desde el frontend
app.use(express.json());

// Ruta de prueba para verificar conexión entre backend y frontend
app.get("/api/test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Conexión exitosa con PostgreSQL", time: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Error en la conexión a PostgreSQL" });
    }
});

// Iniciar servidor en el puerto 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
