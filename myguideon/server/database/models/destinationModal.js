const AbstractModel = require("../database/AbstractModel");
const database = require("../client"); 

class DestinationModel extends AbstractModel {
  constructor() {
    super({ table: "destination" });
  }

  async add(basicInfo, author) {
    const connection = await database.getConnection(); 
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
    } finally {
      connection.release();
    }
  }

  async update(id, updatedBasicInfo) {
    const connection = await database.getConnection();
    try {
      const query = "UPDATE destination SET basic_info = ? WHERE id = ?";
      await connection.execute(query, [JSON.stringify(updatedBasicInfo), id]);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
      throw error;
    } finally {
      connection.release(); 
    }
  }
}

module.exports = new DestinationModel();
