const mysql = require("mysql2/promise");
require("dotenv").config({ path: "./.env" });

const port = process.env.MYSQL_PORT;
const host = process.env.DB_HOST;
const database = process.env.MYSQL_DATABASE;
const dbuser = process.env.MYSQL_USER;
const dbPassword = process.env.MYSQL_PASSWORD;

const pool = mysql.createPool({
  host,
  database,
  user: dbuser,
  password: dbPassword,
  port,
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

module.exports = {
  pool,
  getConnection,
};
