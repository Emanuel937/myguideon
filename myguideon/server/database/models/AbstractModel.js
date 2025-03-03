
const {pool} = require("../client");

class AbstractModel {
  constructor({ table }) {
    if (this.constructor === AbstractModel) {
      throw new TypeError(
        "Abstract class 'AbstractModel' cannot be instantiated directly "
      );
    }

    this.table = table;
    
    this.pool = pool;
  }
}

module.exports = AbstractModel;
