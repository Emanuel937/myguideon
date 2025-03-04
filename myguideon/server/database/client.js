const mysql = require("mysql2/promise");
require("dotenv").config({ path: "./.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error("❌ Impossible d'obtenir une connexion :", error);
    throw error;
  }
}

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Connexion réussie ! Résultat :', rows);
  } catch (error) {
    console.error('Erreur de connexion :', error);
  }
}

testConnection();

module.exports = {
  pool,
  getConnection,
};
