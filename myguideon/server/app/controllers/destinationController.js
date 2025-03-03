const  Destination                        = require('../../database/models/destinationModal');
const { notifyTheAuthor, notifyAllAdmin } = require('../utils/notifications');





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
    }
};

module.exports = destinationController;
