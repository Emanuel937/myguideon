const AbstractModel = require('../database/AbstractModel');

class UserAdminModal extends AbstractModel {
    constructor() {
        super({ table: 'user_admin' });
    }

    async add(name, permissions) {
        const query = 'INSERT INTO equipes (name, permissions) VALUES (?, ?)';
        const [result] = await db.execute(query, [name, JSON.stringify(permissions)]);
        return result.insertId;
    }

    async update(id, permissions) {
        const query = 'UPDATE equipes SET permissions = ? WHERE id = ?';
        await db.execute(query, [JSON.stringify(permissions), id]);
    }

    
}

module.exports = new UserAdminModal();
