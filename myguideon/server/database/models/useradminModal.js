const AbstractModel  = require("./AbstractModel");

class UserAdminModel extends AbstractModel {
    constructor() {
        super({ table: "user_admin" }); 
    }
    
    // add user admin
    async add(name, permissions) {
        const query = "INSERT INTO user_admin (name, permissions) VALUES (?, ?)";
        const connection = await this.database.getConnection(); 
        try {
            const [result] = await connection.execute(query, [name, JSON.stringify(permissions)]);
            return result.insertId;
        }catch(error) {
            console.log(error)
        }
        finally{
            connection.release();
          }
    }

    
    async addPermissions(name, permissions){

        const connection  =  await this.database.getConnection();
        const query       =  "INSERT INTO permissions (name, permissions) VALUES (?, ?)";
        try{
            const[result] = await connection.execute(query, [name, permissions]);

            return result;
        }finally{
            connection.release();
        }
    }
    

    // update permissions
    async update(id, permissions) {
        const query = "UPDATE user_admin SET permissions = ? WHERE id = ?";
        const connection = await this.database.getConnection();
        try {
            await connection.execute(query, [JSON.stringify(permissions), id]);
        } catch(error) {
            console.log(error)
        }
        finally{
            connection.release();
          }
    }

    async findByEmail(email){
        const query =  "SELECT * FROM user_admin WHERE  email = ? ";
        const connection = await this.database.getConnection();

        try{
            const response = await connection.execute(query, [email]);
            return response;

        } catch(error) {
            console.log(error)
        }
        finally{
            connection.release();
          }
        
    }
    async resetCode(resetCode, email)
    {   
        const connection = await this.database.getConnection();

        const query = 'UPDATE user_admin SET reset_code = ? WHERE email = ?';

        await connection.execute(query, [resetCode, email]);
       
        connection.release();
      
    }

    async verifyCode(email, code){

        const connection  = await this.database.getConnection();

        const query = 'SELECT * FROM user_admin WHERE email = ? AND reset_code = ?';

        const response =  await connection.execute(query, [email, code]);

        connection.release();

        return response;
    }


    async updateNewPassword(newPassword, email){

        const connection  = await this.database.getConnection();
        const query       = 'UPDATE user_admin SET password = ?, reset_code = NULL, isfirsttime = NULL WHERE email = ?';

        await connection.execute(query, [newPassword, email]);

        connection.release();

       
    }

    async findAll(){
        console.log('getting ....');
        const connection  = await this.database.getConnection();
        const query       = 'SELECT * FROM user_admin';

        const response    =  await connection.execute(query);
        
        connection.release();

        return response;
    }

    async findById(id){ 
        const connection  = await this.database.getConnection();
        const query       = 'SELECT * FROM user_admin WHERE id = ?';

        const response    =  await connection.execute(query, [id]);

        connection.release();

        return response;
    }

    async findAllPermissions(){
        const connection  = await this.database.getConnection();
        const query       = 'SELECT * FROM permissions';

        const response    =  await connection.execute(query);

        connection.release();

        return response;
    }

    async updatePermissios(permission, id){
        const connection  =  await this.database.getConnection();
        const query       =  "UPDATE permissions SET permissions = ? WHERE id = ?"
        try{
            await connection.execute(query, [permission, id]);

        }finally{
            connection.release();
        }
    }


   async deleteRoles(id){

     const connection =  await this.database.getConnection();
     const query      = "DELETE FROM permissions WHERE id = ?";

     try{

        connection.execute(query, [id]);
     }finally{
        connection.release();
     }
   }
      
  
  async addAdminUser(name, email, password, avatar, profil_id, isfirstTime){

    const connection =  await this.database.getConnection();
    const query =  "INSERT INTO user_admin (name, email, password, avatar, profil_id, isfirsttime) VALUES (?, ?, ?, ?, ?, ?)";
  
    try{

        const [result] =  connection.execute(query, [name, email, password, avatar, profil_id, isfirstTime]);

    }finally{
        connection.release();
    }

}
   async updateUser(name, email, password, avatar, profil_id, id){
  
        const query = `  UPDATE user_admin SET name = ?, email = ?, password = ?, avatar = ?, profil_id = ?
                        WHERE id = ?`;

        const connection =  await this.database.getConnection();
        try{

            connection.execute(query, [name, email, password, avatar, profil_id, id]);
    
        }finally{
            connection.release();
        }
   }


   async deleteUser(id)
   {

        const connection  =  await this.database.getConnection();

        const query = 'DELETE FROM user_admin WHERE id = ?';

        try{
           const [result] = await connection.execute(query, [id]);

           return result;

        }finally{   
            connection.release();
        }
   }

}

module.exports = new UserAdminModel();
