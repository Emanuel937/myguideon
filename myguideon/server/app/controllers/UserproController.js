const tables = require('../../database/table');

// ➡️ Récupérer tous les UserPro
const getAllUserPros = async (req, res) => {
  try {
    const userpros = await tables.userpro.getAllUserPros();
    res.status(200).json(userpros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ➡️ Récupérer un UserPro par ID
const getUserProById = async (req, res) => {
  try {
    const { id } = req.params;
    const userpro = await tables.userpro.getUserProById(id);
    if (userpro) {
      res.status(200).json(userpro);
    } else {
      res.status(404).json({ error: 'UserPro non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ➡️ Ajouter un UserPro
const addUserPro = async (req, res) => {
  try {
    const newUserPro = await tables.userpro.addUserPro(req.body);
    res.status(201).json(newUserPro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ➡️ Mettre à jour un UserPro
const updateUserPro = async (req, res) => {
  try {
    const { id } = req.params;
    const isUpdated = await tables.userpro.updateUserPro(id, req.body);
    if (isUpdated) {
      res.status(200).json({ message: 'UserPro mis à jour avec succès' });
    } else {
      res.status(404).json({ error: 'UserPro non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ➡️ Supprimer un UserPro
const deleteUserPro = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await tables.userpro.deleteUserPro(id);
    if (isDeleted) {
      res.status(200).json({ message: 'UserPro supprimé avec succès' });
    } else {
      res.status(404).json({ error: 'UserPro non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/***********************EXPORTS************************************** */
module.exports = {
  getAllUserPros,
  getUserProById,
  addUserPro,
  updateUserPro,
  deleteUserPro,
};
