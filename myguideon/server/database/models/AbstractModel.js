const { pool } = require('../client');  

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
    this.pool = pool; 
  }
}

module.exports = AbstractModel;
