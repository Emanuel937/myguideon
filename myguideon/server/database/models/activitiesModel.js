const AbstractModel = require('./AbstractModel');

class ActivitiesModel extends AbstractModel {
  constructor() {
    super({ table: 'activities' });
  }

  /**
   * 
   * @param {number} id 
   * @returns 
   */
async getActivityById(id) {
  const [row] = await this.pool.query(
    `SELECT a.*, 
    JSON_ARRAYAGG(JSON_OBJECT(
        'id', i.id,
        'url', i.url,
        'alt_text', i.alt_text,
        'description', i.description,
        'type', i.type
        )) AS images
    FROM ${this.table} a
    LEFT JOIN activity_images ai ON a.id = ai.activity_id
    LEFT JOIN images i ON ai.image_id = i.id
    WHERE a.id = ?
    GROUP BY a.id`,  
      [id]
  ) 
  return row.length>0 ? row[0] : null;
}  

/**
 * @async
 * @returns {Promise<Object[]>}
 * @throws {Error}
 */
async getAllActivities() {
const [rows] = await this.pool.query(
    `SELECT a.*, 
    JSON_ARRAYAGG(JSON_OBJECT(
        'id', i.id,
        'url', i.url,
        'alt_text', i.alt_text,
        'description', i.description,
        'type', i.type
        )) AS images
    FROM ${this.table} a
    LEFT JOIN activity_images ai ON a.id = ai.activity_id
    LEFT JOIN images i ON ai.image_id = i.id
    GROUP BY a.id`
) 
return rows;
}

/**
 * 
 * @param {Object} activity 
 * @param {string} activity.name
 * @param {string} activity.description 
 * @param {number} activity.price 
 * @param {string} activity.currency -USD or EUR EUR par default
 * @param {string} activity.imageCover
 * @param {string} activity.location
 * @param {number} activity.latitude
 * @param {number} activity.longitude
 * @param {string} activity.language
 * @param {number} activity.duration
 * @param {number} activity.max_participants
 * @param {string[]} activity.availability
 * @param {number} activity.age_limit
 * @param {string} activity.category
 * @param {string} activity.status
 * @param {number} activity.created_by
 * @param {number} activity.image_cover_id
 * @param {string} activity.imageAlt
 * @param {string} activity.imageDescription
 * @returns {Promise<Object>}
 * @throws {Error}
 */
async addActivity(activity) {
    const connection = await this.pool.getConnection();
    try {
       await connection.beginTransaction();
 
       // ➡️ Insérer l'image de couverture dans la table `images`
       const [imageResult] = await connection.query(
           "INSERT INTO images (url, alt_text, description, type, owner_id, owner_type, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
           [
               activity.imageCover,
               activity.imageAlt || 'Image d\'activité',
               activity.imageDescription || '',
               'cover',
               activity.created_by,
               'userpro'
           ]
       );
 
       // ➡️ Insérer l'activité avec l'ID de l'image
       const [result] = await connection.query(
           `INSERT INTO ${this.table} (name, description, price, currency, imageCover, location, latitude, longitude, language, duration, max_participants, availability, age_limit, category, status, created_by, created_at, image_cover_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?)`,
           [
               activity.name,
               activity.description,
               activity.price,
               activity.currency,
               activity.imageCover,
               activity.location,
               activity.latitude,
               activity.longitude,
               activity.language,
               activity.duration,
               activity.max_participants,
               JSON.stringify(activity.availability),
               activity.age_limit,
               activity.category,
               activity.status,
               activity.created_by,
               imageResult.insertId
           ]
       );
 
       // ➡️ Insérer chaque image de la galerie dans `images` puis dans `activity_images`
       if (Array.isArray(activity.gallery) && activity.gallery.length > 0) {
        for (const imageUrl of activity.gallery) {
            const [galleryImageResult] = await connection.query(
                "INSERT INTO images (url, alt_text, description, type, owner_id, owner_type, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
                [
                    imageUrl,
                    'Image de la galerie',
                    '',
                    'gallery',
                    activity.created_by,
                    'userpro'
                ]
            );
    
            await connection.query(
                "INSERT INTO activity_images (activity_id, image_id) VALUES (?, ?)",
                [result.insertId, galleryImageResult.insertId]
            );
        }
    }
 
       await connection.commit();
       return { id: result.insertId, ...activity };
    } catch (error) {
       await connection.rollback();
       console.error(error);
       throw new Error('Erreur lors de l\'ajout de l\'activité');
    } finally {
       connection.release();
    }
 }
 
 
/**
 * 
 * @param {number} id 
 * @param {Object} activity
 * @param {string} activity.name
 * @param {string} activity.description
 * @param {number} activity.price
 * @param {string} activity.currency -USD or EUR EUR par default
 * @param {string} activity.imageCover
 * @param {string} activity.location
 * @param {number} activity.latitude
 * @param {number} activity.longitude
 * @param {string} activity.language
 * @param {number} activity.duration
 * @param {number} activity.max_participants
 * @param {string[]} activity.availability
 * @param {number} activity.age_limit
 * @param {string} activity.category
 * @param {string} activity.status
 * @param {number} activity.image_cover_id
 * @param {string} activity.imageAlt
 * @param {string} activity.imageDescription
 * @returns {Promise<boolean>}
 * @throws {Error}
 */

 async updateActivity(id, activity) {
    const connection = await this.pool.getConnection();
    try {
        await connection.beginTransaction();

        // ➡️ Mettre à jour l'image de couverture
        await connection.query(
            "UPDATE images SET url = ?, alt_text = ?, description = ?, updated_at = NOW() WHERE id = ?",
            [
                activity.imageCover,
                activity.imageAlt || 'Image d\'activité',
                activity.imageDescription || '',
                activity.image_cover_id
            ]
        );

        // ➡️ Supprimer les anciennes images de la galerie dans `activity_images`
        await connection.query(
            "DELETE FROM activity_images WHERE activity_id = ?",
            [id]
        );

        // ➡️ Réinsérer les nouvelles images de la galerie
        if (Array.isArray(activity.gallery) && activity.gallery.length > 0) {
            for (const imageUrl of activity.gallery) {
                // ➡️ Insérer les nouvelles images dans `images`
                const [galleryImageResult] = await connection.query(
                    "INSERT INTO images (url, alt_text, description, type, owner_id, owner_type, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
                    [
                        imageUrl,
                        'Image de la galerie',
                        '',
                        'gallery',
                        activity.created_by,
                        'userpro'
                    ]
                );

                // ➡️ Associer les nouvelles images à l'activité dans `activity_images`
                await connection.query(
                    "INSERT INTO activity_images (activity_id, image_id) VALUES (?, ?)",
                    [id, galleryImageResult.insertId]
                );
            }
        }

        // ➡️ Mettre à jour les autres champs de l'activité
        const [result] = await connection.query(
            `UPDATE ${this.table} SET name = ?, description = ?, price = ?, currency = ?, imageCover = ?, location = ?, latitude = ?, longitude = ?, language = ?, duration = ?, max_participants = ?, availability = ?, age_limit = ?, category = ?, status = ?, updated_at = NOW(), image_cover_id = ? WHERE id = ?`,
            [
                activity.name,
                activity.description,
                activity.price,
                activity.currency,
                activity.imageCover,
                activity.location,
                activity.latitude,
                activity.longitude,
                activity.language,
                activity.duration,
                activity.max_participants,
                JSON.stringify(activity.availability),
                activity.age_limit,
                activity.category,
                activity.status,
                activity.image_cover_id,
                id
            ]
        );

        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw new Error("Erreur lors de la mise à jour de l'activité");
    } finally {
        connection.release();
    }
}

/**
 * 
 * @param {number} id 
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
async deleteActivity(id) {
    const connection = await this.pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            "DELETE FROM activity_images WHERE activity_id = ?",
            [id]
        );

        // ➡️ Supprimer l'activité dans `activities`
        const [result] = await connection.query(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );

        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw new Error("Erreur lors de la suppression de l'activité");
    } finally {
        connection.release();
    }
}
/***********************EXPORTS************************************** */
}
module.exports = ActivitiesModel;