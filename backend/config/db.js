const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => {
        console.error("❌ Error connecting to PostgreSQL", err);
        process.exit(1); // Exit the process with failure
    });

module.exports = pool;