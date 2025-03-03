const AbstractModel = require("./AbstractModel");

class DestinationModel extends AbstractModel {
  constructor() {
    super({ table: "destination" });
  }

  async add(basicInfo, author) {
    const connection = await this.pool.getConnection(); 
    try {
      const query =
        "INSERT INTO destination (basic_info, author) VALUES (?, ?)";
      const [result] = await connection.execute(query, [
        JSON.stringify(basicInfo),
        author,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error);
      throw error;
    } 
    finally{
      connection.release();
    }
  }

  async update(id, updatedBasicInfo) {

    const connection = await this.pool.getConnection();
    const query = "UPDATE destination SET basic_info = ? WHERE id = ?";
    try {
      
      await connection.execute(query, [JSON.stringify(updatedBasicInfo), id]);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à  jour :", error);
      throw error;
    } 
    finally{
      connection.release();
    }
  }

    async findAll() {
      const connection = await this.pool.getConnection();  

      try {
          const query = "SELECT * FROM destination";
          const [destination] = await connection.execute(query);
          return destination;
         
      } catch (error) {
          console.error("❌ :", error);
          return res.status(500).json({ error: "Une erreur est survenue" }); // ✅ Retourner une réponse en cas d'erreur
      }
      finally{
        connection.release();
      }
  }
    async findById(id) {
      const connection = await this.pool.getConnection();  

      try {
          const query = "SELECT * FROM destination WHERE id = ?";
          const [destination] = await connection.execute(query,[id] );

          return destination[0];
        
      } catch (error) {
          console.error("❌ :", error);
          return res.status(500).json({ error: "Une erreur est survenue" }); 
      }
      finally{
        connection.release();
      }
  }

  async deleteDestination(id){

    const connection = await this.pool.getConnection(); 

    try{
        const query =  "DELETE FROM destination WHERE id = ?";
        await connection.execute(query, [id])

    }finally{
      connection.release();
    }
    
  }
} 

module.exports = DestinationModel;
