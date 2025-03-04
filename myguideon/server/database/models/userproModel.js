const AbstractModel = require("./AbstractModel");
const { hashPassword, verifyPassword } = require('../../app/helpers/argonHelper');                                                              
const { generateToken } = require('../../app/helpers/jwtHelper');

class UserProModel extends AbstractModel {
  constructor() {
    super({table: "userpro"});
    }

/**
 * get all users
 * @returns {Promise<Object[]>} All users
 */
async getAllUsersPro() {
    const [rows] = await this.pool.query(
        `SELECT  id,name,company_name,address,email,phone,description,profile_image FROM ${this.table}`
    )
    return rows;
}
/**
 * get a user by id
 * @param {number} id 
 * @returns {Promise<Object|null>} User or null if not found
 */
async getUserProById(id) {
    const [rows] = await this.pool.query(
        `SELECT id,name,company_name,email,phone,image_profile FROM ${this.table} WHERE id = ?`, [id]
    )
    return rows[0];
}
/**
 * add a new user
 * @param {Object} data 
 * @returns {Promise<Object>} User
 * @throws {Error} If the email is already in use
 * @throws {Error} If the password is invalid
 */
async AddUserPro(data) {
    try {
      const hashedPassword = await hashPassword(data.password);
      const [result] = await this.pool.query(
        `INSERT INTO ${this.table} (name,company_name, email, phone, password, profile_image, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [data.name,data.company_name, data.email, data.phone, hashedPassword, data.profile_image]
      );
      const token = generateToken({ id: result.insertId, email: data.email });
      return { id: result.insertId, token };
    } catch (error) {
      console.error("❌ ERREUR SQL AddUserPro:", error);
      throw new Error("Erreur lors de l'ajout du userpro");
    }
  }

/**
 * update a user
 * @param {number} id 
 * @param {Object} data 
 * @returns {Promise<boolean>} True if the user was updated, false otherwise
 */
async updateUserPro(id,data) {
    const fields = [];
    const values = [];
    if (data.company_name) {
        fields.push('company_name = ?');
        values.push(data.company_name);
    }
    if (data.email) {
        fields.push('email = ?');
        values.push(data.email);
    }
    if (data.phone) {
        fields.push('phone = ?');
        values.push(data.phone);
    }
    if (data.profile_image) {
        fields.push('profile_image = ?');
        values.push(data.profile_image);
    }
    if (data.password) {
        const hashedPassword = await hashPassword(data.password);
        fields.push('password = ?');
        values.push(hashedPassword);
    }
    values.push(id);
    const [result] = await this.pool.query(
        `UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`, values
    );
    return result.affectedRows > 0 ;
}
/**
 * delete a user
 * @param {number} id 
 * @returns {Promise<boolean>} True if the user was deleted, false otherwise
 * @throws {Error} If the user was not found
 * @throws {Error} If the user could not be deleted
 */
 
async deleteUserPro(id) {
    const [result] = await this.pool.query(
        `DELETE FROM ${this.table} WHERE id = ?`, [id]
    )
    return result.affectedRows > 0;
}
/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object|null>} User or null if not found
 * @throws {Error} If the password is invalid
 * @throws {Error} If the user is not found
 */

async authenticateUserPro(email, password) {
    const [rows] = await this.pool.query(`SELECT id, password, role_id FROM ${this.table} WHERE email = ?`,
     [email]);
    if (rows.length === 0) return null;

    const user = rows[0];
    const isValid = await verifyPassword(user.password, password);
    if (!isValid) return null;

    const token = generateToken({ id: user.id, email, role_id: user.role_id });
    return { id: user.id,role_id:user.role_id, token };
  }


/*******************EXPORT****************************************************** */
}
module.exports = UserProModel;