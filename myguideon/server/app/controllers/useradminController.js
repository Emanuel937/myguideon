const UserAdmin = require('../models/useradminModal');
const bcrypt = require('bcrypt');

const userAdminController = {

    async addUserAdmin(req, res) {
        try {
            const { name, email, password, role, permissions } = req.body;

            if (!name || !email || !password || !role || !permissions) {
                return res.status(400).json({ message: 'Tous les champs sont requis' });
            }

            const insertedId = await UserAdmin.add({ name, email, password, role, permissions });

            res.status(200).json({ 
                message: "Administrateur ajouté avec succès", 
                id: insertedId, 
                data: { name, email, role, permissions } 
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
            res.status(500).json({ message: "Erreur serveur lors de l'ajout de l'administrateur." });
        }
    },

    async deleteUserAdmin(req, res) {
        try {
            const success = await UserAdmin.deleteById(req.params.id);
            if (success) {
                res.json({ message: 'Administrateur supprimé avec succès.' });
            } else {
                res.status(404).json({ message: 'Administrateur non trouvé.' });
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    },

    
    async getAllUserAdmins(req, res) {
        try {
            const users = await UserAdmin.findAll();
            res.status(200).json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des administrateurs:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    },

    async getUserAdminById(req, res) {
        try {
            const user = await UserAdmin.findById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'Administrateur non trouvé.' });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'administrateur:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    },


    async updateUserAdmin(req, res) {
        try {
            const { id } = req.params;
            const { name, email, role, permissions } = req.body;

            if (!name || !email || !role || !permissions) {
                return res.status(400).json({ message: 'Tous les champs sont requis' });
            }

            await UserAdmin.update(id, { name, email, role, permissions });
            res.status(200).json({ message: "Administrateur mis à jour avec succès." });

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'administrateur." });
        }
    },

    
    async login(req, res) {
        const { email, password } = req.body;
      

        try {
         const rows =  await UserAdmin.findByEmail(email);
        
          if (rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
          }
          const user = rows;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
          }
          res.status(200).json({ message: user.id, isfirstTime: user.isfirsttime });
        } catch (error) {

      
          console.error('Erreur lors de la connexion :', error);
          res.status(500).json({ error: 'Erreur interne du serveur.' });
        }
      },

      async resetPassword(req, res){

        const { email } = req.body;


        
          const resetCode = Math.floor(100000 + Math.random() * 900000);
      
       
         try{

         await UserAdmin.setCodeValidation(email, resetCode);
         // after move it to utils then create an email template ....

          const mailOptions = {
          
            to: email,
            subject: 'Code de réinitialisation de mot de passe',
            html: `
              <h1>Code de réinitialisation</h1>
              <p>Bonjour ${user.name},</p>
              <p>Votre code de réinitialisation est : <b>${resetCode}</b></p>
              <p>Ce code expirera dans 10 minutes.</p>
            `,
          };
      
          sendMail(mailOptions.to, mailOptions.subject,  mailOptions.html);
      
          res.status(200).json({ message: 'Un code de réinitialisation a été envoyé à votre adresse e-mail.' });
        } catch (error) {
          console.error('Erreur lors de l\'envoi du code de réinitialisation :', error);
          res.status(500).json({ error: 'Erreur interne du serveur.' });
        }
      }

};

module.exports = userAdminController;
