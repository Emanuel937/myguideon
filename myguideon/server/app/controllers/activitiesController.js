const tables = require ('../../database/table');

/**
 * 
 * @param {REQUEST} req 
 * @param {RESPONSE} res
 * @returns 
 */
const getAllActivities = async (req, res) => {
    try {
      const activities = await tables.activities.getAllActivities();
      res.status(200).json(activities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

const getActivityById = async (req, res) => {
    try {
      const activity = await tables.activities.getActivityById(req.params.id);
      res.status(200).json(activity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

const addActivity = async (req, res) => {
    try {
      const activity = await tables.activities.addActivity({
        ...req.body,
        imageAlt: req.body.imageAlt || 'Image d\'activité',
        imageDescription: req.body.imageDescription || ''
    });
      res.status(201).json({
        message: 'Activité ajoutée avec succès',
        activity});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

const updateActivity = async (req, res) => {
    try {
     const rowsAffected = await tables.activities.updateActivity(req.params.id, {
        ...req.body,
        imageAlt: req.body.imageAlt || 'Image d\'activité',
        imageDescription: req.body.imageDescription || ''
    });
      if (rowsAffected === 0) {
        res.status(404).json({ error: 'Activité non trouvée' });
      } else {
        res.status(200).json({ message: 'Activité mise à jour avec succès' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  const deleteActivity = async (req, res) => {
    try {
      const rowsAffected = await tables.activities.deleteActivity(req.params.id);
      if (rowsAffected === 0) {
        res.status(404).json({ error: 'Activité non trouvée' });
      } else {
        res.status(200).json({ message: 'Activité supprimée avec succès.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
  
  module.exports = {
    getAllActivities,
    getActivityById,
    addActivity,
    updateActivity,
    deleteActivity,
  };