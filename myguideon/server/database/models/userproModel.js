const AbstractModel = require("./AbstractModel");

class UserProModel extends AbstractModel {
  constructor() {
    super({table: "userpro"});
    }

async getAllUsersPros() {
    const [rows] = await this.pool.query(
        `SELECT * FROM ${this.table}`
    )
    return rows;
}

async getUserProById(id) {
    const [rows] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE id = ?`, [id]
    )
    return rows[0];
}

async AddUserPro(userpro) {
    const [result] = await this.pool.query(
        `INSERT INTO ${this.table} (name,email,password,avatar,created_at,updated_at)
        VALUE (?,?,?,?,NOW(), NOW())`,
        [userpro.name, userpro.email, userpro.password, userpro.avatar]
    )
    return {id: result.insertId, ...userpro}
}

async updateUserPro(id, userpro) {
    const [result] = await this.pool.query(
        `UPDATE ${this.table} SET name = ?, email = ?, password = ?, avatar = ?, updated_at = NOW() WHERE id = ?`,
        [userpro.name, userpro.email, userpro.password, userpro.avatar, id]
    )
    return result.affectedRows > 0 ;
}

async deleteUserPro(id) {
    const [result] = await this.pool.query(
        `DELETE FROM ${this.table} WHERE id = ?`, [id]
    )
    return result.affectedRows > 0;
}


/*******************EXPORT****************************************************** */
}
module.exports = UserProModel;