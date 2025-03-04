const { pool } = require('../client');  // Assure-toi que le chemin est correct !

class AbstractModel {
  async getConnection() {
    if (!this.pool) throw new Error("Pool de connexion non défini !");
    return await this.pool.getConnection();
  }

  constructor({ table }) {
    if (this.constructor === AbstractModel) {
      throw new TypeError(
        "Abstract class 'AbstractModel' cannot be instantiated directly"
      );
    }

    this.table = table;
    this.pool = pool;  // Utilise le pool importé depuis client.js
  }
}

module.exports = AbstractModel;
