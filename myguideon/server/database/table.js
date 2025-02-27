const db = require("./client"); // Importation du fichier client.js

// 📌 Fonction pour créer les tables si elles n'existent pas déjà
async function createTables() {
    try {
        // Table `categories`
        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                categories_name VARCHAR(255) NOT NULL,
                categories_parent_id INT DEFAULT NULL,
                description TEXT,
                image VARCHAR(255) DEFAULT NULL
            );
        `);

        // Table `destination`
        await db.query(`
            CREATE TABLE IF NOT EXISTS destination (
                id INT AUTO_INCREMENT PRIMARY KEY,
                basic_info TEXT NOT NULL,
                gallery TEXT,
                activity TEXT,
                pratical_info TEXT,
                imageCover VARCHAR(2000) DEFAULT NULL,
                activities TEXT,
                culture TEXT,
                info TEXT,
                historical TEXT,
                author VARCHAR(500) DEFAULT NULL
            );
        `);

        // Table `equipes`
        await db.query(`
            CREATE TABLE IF NOT EXISTS equipes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(500) DEFAULT NULL,
                permissions TEXT
            );
        `);

        // Table `things_to_do`
        await db.query(`
            CREATE TABLE IF NOT EXISTS things_to_do (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name TEXT NOT NULL,
                adress VARCHAR(500) NOT NULL,
                destination_id VARCHAR(500) DEFAULT NULL,
                description TEXT NOT NULL,
                logintude VARCHAR(500) DEFAULT NULL,
                icon TEXT NOT NULL,
                gallery TEXT NOT NULL,
                destination_name VARCHAR(500) NOT NULL,
                lant VARCHAR(500) DEFAULT NULL,
                category VARCHAR(500) DEFAULT NULL,
                status VARCHAR(500) DEFAULT NULL
            );
        `);

        // Table `user_admin`
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(500) NOT NULL,
                email VARCHAR(500) NOT NULL,
                password TEXT,
                avatar VARCHAR(500) DEFAULT NULL,
                profil_id VARCHAR(500) DEFAULT NULL,
                reset_code VARCHAR(500) DEFAULT NULL,
                isfirsttime VARCHAR(500) DEFAULT NULL
            );
        `);

        console.log("✅ Toutes les tables ont été créées avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de la création des tables :", error);
    }
}

// 📌 Exécuter la création des tables
createTables();

module.exports = { createTables };
