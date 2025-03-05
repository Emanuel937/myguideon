const  Destination                        = require('../../database/models/destinationModal');
const { notifyTheAuthor, notifyAllAdmin } = require('../utils/notifications');
const{v4:uuidv4} = require('uuid');
const path   = require('path');
const fs     = require('fs');



const destinationController = {


    async addDestination(req, res) {
        try {
            const { destinationName, language, budget, currency, status, address, categories, lon, lat, author } = req.body;
            let imgpath = null;

            if (req.files && req.files['weather_image'] && req.files['weather_image'][0]) {
                imgpath = `/public/assets/images/${req.files['weather_image'][0].filename}`;
            }

            const basicInfo = { destinationName, language, budget, currency, status, address, categories, lon, lat, imgpath };
            const insertedId = await Destination.add(basicInfo, author);

            res.status(200).json({ message: "Destination ajoutée avec succès", id: insertedId, data: basicInfo });
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            res.status(500).json({ message: "Erreur lors de l'ajout de la destination." });
        }
    },

    async updateDestination(req, res){
        

        const { id } = req.params; 
        var { destinationName, language, budget, currency, status, address, categories, lon, lat, author} = req.body;
        
        console.log("id ", req.body);
        if (!id) {
            return res.status(400).json({ message: "ID de la destination manquant ou invalide." });
        }
        
        const updatedBasicInfo = {
            destinationName,
            language,
            budget,
            currency,
            status,
            address,
            categories,
            lon,
            lat
        };

       

        const checkQuery = await Destination.findById(id);

        if (checkQuery.length === 0) {
            return res.status(404).json({ message: "Destination introuvable." });
        }
        try{
           
           await Destination.update(id, updatedBasicInfo);

           notifyTheAuthor(status, author, id);
           notifyAllAdmin(status, id);

           
            res.status(200).json({
                message: "Informations de la destination mises à jour avec succès.",
                data: updatedBasicInfo,
            });

        }catch(error){
            console.error('Erreur lors de la vérification de la destination:', error);
            res.status(500).json({ message: "Erreur lors de la vérification de la destination." });
        }

         
             
        },



    async deleteDestination(req, res) {
        try {
            const success = await Destination.deleteDestination(req.params.id);
            if (success) {
                res.json({ message: 'Destination supprimée avec succès.' });
            } else {
                res.status(404).json({ message: 'Destination non trouvée.' });
            }
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    },

    async getAllDestinations(req, res){
        try {
            const destinations = await Destination.findAll();
            res.status(200).json(destinations);
        } catch (error) {
            console.error('Erreur lors de la récupération des destinations:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    },

    async getDestinationById(req, res){

        try {
            const destinations = await Destination.findById(req.params.id);
            res.status(200).json(destinations);

        } catch (error) {
            console.error('Erreur lors de la récupération des destinations:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    },


    async destinationDetailsAdmin(req, res){
        const { id } = req.params; 

        try {
         
            // query 
            const destination =  await Destination.findById(id);
        
          if (destination.length === 0) {
            return res.status(404).json({ message: `Aucune destination trouvée avec l'id ${id}.` });
          }
      
          res.status(200).json({
            message: "Destination récupérée avec succès.",
            data: destination,
          });
        } catch (error) {
          console.error('Erreur lors de la récupération de la destination:', error);
          res.status(500).json({ message: "Erreur lors de la récupération de la destination." });
        }
    },

    async updateGallery(req, res) {
      const destinationId = req.params.id;
    
      try {
        // 📂 Définition des dossiers de stockage
        const imgDir = path.join(__dirname, "../public/assets/img/gallery");
        const videoDir = path.join(__dirname, "../public/assets/video/gallery");
    
        // 📌 Création des dossiers s'ils n'existent pas
        if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
        if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
    
        let { cover, deletedImages } = req.body;
    
        // 🔍 Récupérer la galerie actuelle depuis la base
        const [rows] = await Destination.findDestinationGalleryById(destinationId);
        let oldGallery = (rows.length > 0 && rows[0].gallery) ? JSON.parse(rows[0].gallery) : [];
    
        // 🗑️ Suppression des anciennes images
        if (deletedImages) {
          try {
            const deletedList = JSON.parse(deletedImages);
            if (!Array.isArray(deletedList)) {
              throw new Error("deletedImages doit être un tableau.");
            }
    
            oldGallery = oldGallery.filter((file) => !deletedList.includes(file));
    
            deletedList.forEach((filePath) => {
              const fullPath = path.join(__dirname, `../${filePath}`);
              if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
              }
            });
          } catch (err) {
            console.error("❌ Erreur lors de la suppression des fichiers:", err);
          }
        }
    
        // 📥 Gestion des nouveaux fichiers uploadés
        let newFiles = [];
        if (req.files && Array.isArray(req.files)) {
          newFiles = req.files.map((file) => {
            const isVideo = file.mimetype.startsWith("video/");
            const filePath = `/public/assets/${isVideo ? "video/gallery" : "img/gallery"}/${file.filename}`;
    
            // 🖼️ Met à jour la couverture si elle correspond à un fichier uploadé
            if (cover === file.originalname) {
              cover = filePath;
            }
            return filePath;
          });
        }
    
        // 🖼️ Mettre à jour la galerie avec les nouvelles images/vidéos
        const updatedGallery = [...oldGallery, ...newFiles];
    
        // 📌 Met une image par défaut comme couverture si aucune n'est définie
        if (!cover || cover.length === 0) {
          cover = updatedGallery.length > 0 ? updatedGallery[0] : null;
        }
    
        // 📂 Mise à jour dans la base de données
        await Destination.setGalleryAndCover(JSON.stringify(updatedGallery), cover, destinationId);
    
        res.status(200).json({
          message: "✅ Galerie mise à jour avec succès",
          data: { galleryImages: updatedGallery, imageCover: cover },
        });
    
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la galerie:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de la galerie" });
      }
    }
    
 
    

};

module.exports = destinationController;
