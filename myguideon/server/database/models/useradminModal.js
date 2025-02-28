const AbstractModel = require("../database/AbstractModel");
const database      = require("../database/client"); 

class UserAdminModel extends AbstractModel {
    constructor() {
        super({ table: "user_admin" }); 
    }

    async add(name, permissions) {
        const query = "INSERT INTO user_admin (name, permissions) VALUES (?, ?)";
        const connection = await database.getConnection(); 
        try {
            const [result] = await connection.execute(query, [name, JSON.stringify(permissions)]);
            return result.insertId;
        } finally {
            connection.release(); 
        }
    }

    async update(id, permissions) {
        const query = "UPDATE user_admin SET permissions = ? WHERE id = ?";
        const connection = await database.getConnection();
        try {
            await connection.execute(query, [JSON.stringify(permissions), id]);
        } finally {
            connection.release();
        }
    }
}

module.exports = new UserAdminModel();
