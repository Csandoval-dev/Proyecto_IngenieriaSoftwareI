const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Import the database configuration

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend connection successful", time: { now: new Date().toISOString() } });
});

const PORT = process.env.PORT || 5001; // Change the port to 5001
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});