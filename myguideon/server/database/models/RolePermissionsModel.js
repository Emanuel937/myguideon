const AbstractModel = require('./AbstractModel');

class RolePermissionsModel extends AbstractModel {
    constructor() {
        super({ table: 'role_permissions' });
    }

    /**
     * Récupère les permissions pour un rôle donné
     * @param {number} roleId - L'ID du rôle
     * @returns {Promise<Object[]>} - Liste des permissions
     */
    async getPermissionsByRoleId(roleId) {
        const [rows] = await this.pool.query(
            `SELECT p.name FROM role_permissions rp 
             INNER JOIN permissions p ON rp.permission_id = p.id
             WHERE rp.role_id = ?`, 
            [roleId]
        );
        return rows;
    }
}

module.exports = RolePermissionsModel;
