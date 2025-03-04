const tables = require ('../../database/table');
const { validateActivity } = require ('../validator/activitiesValidator');

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

// const addActivity = async (req, res) => {
//     try {
//       const { error } = validateActivity(req.body);
//       if (error) {
//         return res.status(400).json({ error: error.details[0].message }); 
//       }

//       const imageCover = req.files?.imageCover?.[0]?.filename || null;
//       const gallery = req.files?.gallery?.map((file) => file.filename) || [];

//       const newActivity = await tables.activities.addActivity({
//         ...req.body, 
//         imageCover,
//         gallery: JSON.stringify(gallery),
//       });
//       res.status(201).json(newActivity);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// }

const addActivity = async (req, res) => {
  const connection = await tables.activities.getConnection(); // Récupérer une connexion depuis le pool
  await connection.beginTransaction();

  try {
    // ➡️ Valider les données avec JOI
    const { error } = validateActivity(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const imageCover = req.files?.imageCover?.[0]?.filename || null;
    const gallery = req.files?.gallery?.map(file => file.filename) || [];

    // ➡️ Ajouter l'image cover dans `images` et récupérer `image_cover_id`
    let imageCoverId = null;
    if (imageCover) {
      const [result] = await connection.query(
        "INSERT INTO images (url, alt_text, description, created_at) VALUES (?, ?, ?, NOW())",
        [`/assets/img/${imageCover}`, req.body.imageAlt || 'Image d\'activité', req.body.imageDescription || '']
      );
      imageCoverId = result.insertId;
    }

    // ➡️ Ajouter l'activité dans `activities` avec `image_cover_id`
    const newActivity = await tables.activities.addActivity({
      ...req.body,
      imageCover: `/assets/img/${imageCover}`,
      image_cover_id: imageCoverId,
    });

    // ➡️ Ajouter les images de `gallery` dans `images` et `activity_images`
    if (gallery.length > 0) {
      const galleryPromises = gallery.map(async (file) => {
        const [imgResult] = await connection.query(
          "INSERT INTO images (url, alt_text, description, created_at) VALUES (?, ?, ?, NOW())",
          [`/assets/img/${file}`, 'Image de la galerie', '']
        );
        const imageId = imgResult.insertId;

        await connection.query(
          "INSERT INTO activity_images (activity_id, image_id) VALUES (?, ?)",
          [newActivity.id, imageId]
        );
      });
      await Promise.all(galleryPromises);
    }

    await connection.commit();
    res.status(201).json(newActivity);
  } catch (error) {
    console.log("Erreur détectée :", error);
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    connection.release(); // Libérer la connexion
  }
};

const updateActivity = async (req, res) => {
  const connection = await tables.activities.getConnection();
  await connection.beginTransaction();

  try {
    // ➡️ Valider les données avec JOI
    const { error } = validateActivity(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const imageCover = req.files?.imageCover?.[0]?.filename || null;
    const gallery = req.files?.gallery?.map(file => file.filename) || [];
    const { id } = req.params;

    let imageCoverId = null;
    if (imageCover) {
      const [coverResult] = await connection.query(
        "INSERT INTO images (url, alt_text, description, created_at) VALUES (?, ?, ?, NOW())",
        [`/assets/img/${imageCover}`, req.body.imageAlt || 'Image d\'activité', req.body.imageDescription || '']
      );
      imageCoverId = coverResult.insertId;

      // ➡️ Mettre à jour `image_cover_id` dans `activities`
      await connection.query(
        "UPDATE activities SET image_cover_id = ? WHERE id = ?",
        [imageCoverId, id]
      );
    }

    // ➡️ Mettre à jour `activities` sans toucher à `gallery`
    await connection.query(
      `UPDATE activities SET 
        name = ?, description = ?, price = ?, currency = ?, location = ?, latitude = ?, longitude = ?, 
        language = ?, duration = ?, max_participants = ?, availability = ?, age_limit = ?, category = ?, 
        status = ?, updated_at = NOW() 
        WHERE id = ?`,
      [
        req.body.name,
        req.body.description,
        req.body.price,
        req.body.currency,
        req.body.location,
        req.body.latitude,
        req.body.longitude,
        req.body.language,
        req.body.duration,
        req.body.max_participants,
        JSON.stringify(req.body.availability),
        req.body.age_limit,
        req.body.category,
        req.body.status,
        id
      ]
    );

    // ➡️ Mettre à jour les images `gallery` dans `activity_images` et `images`
    if (gallery.length > 0) {
      // Supprimer les anciennes associations
      await connection.query(
        "DELETE FROM activity_images WHERE activity_id = ?",
        [id]
      );

      const galleryPromises = gallery.map(async (file) => {
        const [imgResult] = await connection.query(
          "INSERT INTO images (url, alt_text, description, created_at) VALUES (?, ?, ?, NOW())",
          [`/assets/img/${file}`, 'Image de la galerie', '']
        );
        const imageId = imgResult.insertId;

        await connection.query(
          "INSERT INTO activity_images (activity_id, image_id) VALUES (?, ?)",
          [id, imageId]
        );
      });
      await Promise.all(galleryPromises);
    }

    await connection.commit();
    res.status(200).json({ message: 'Activité mise à jour avec succès.' });
  } catch (error) {
    console.log("Erreur détectée :", error);
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    connection.release();
  }
};

// const updateActivity = async (req, res) => {
//     try {
//      const { error } = validateActivity(req.body);
//       if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//       }

//       const imageCover = req.files?.imageCover?.[0]?.filename || null;
//       const gallery = req.files?.gallery?.map(file => file.filename) || [];

//       const { id } = req.params;
//       const isUpdated = await tables.activities.updateActivity(id, {
//         ...req.body,
//       imageCover,
//       gallery: JSON.stringify(gallery),
//       });
//       if (isUpdated === 0) {
//         res.status(404).json({ error: 'Activité non trouvée' });
//       } else {
//         res.status(200).json({ message: 'Activité mise à jour avec succès.' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Erreur serveur' });
//     }
//   }

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