const db = require("./client");

class AbstractModel {
    constructor({ table }) {
        this.table = table;
    }

    async findAll() {
        const [rows] = await db.query(`SELECT * FROM ${this.table}`);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        return rows[0];
    }

    async deleteById(id) {
        const result = await db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
        return result.affectedRows;
    }
    async findByEmail(email){
        const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE email = ?`, [email]);
        return rows[0];
    }

    async setCodeValidation(email, resetCode){
  
       const [rows] =  this.findByEmail(email);

       if (rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      const userEmail = rows.email;

      await db.execute('UPDATE user_admin SET reset_code = ? WHERE email = ?', [resetCode, email])
      return rows[0];
    
    }
}

module.exports = AbstractModel;
