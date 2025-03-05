const UserAdmin                              = require('../../database/models/useradminModal');
const sendMail                               = require('../utils/transporter');
const {hashPassword, verifyPassword}         = require('../helpers/argonHelper');
const loginValidator                         = require('../validator/loginValidator');
const registerValidator                      = require('../validator/registerValidator');
const {generateToken}                        = require('../helpers/jwtHelper');


const userAdminController = {

    async addUserAdmin(req, res){

    
    const { error } = registerValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const  {name, email, password, avatar, profileId}  = req.body;

    const [emailExist] = await UserAdmin.findByEmail(email);

   if(emailExist.length > 0)
   {
        return res.status(200).json({ error:true, message: "C'est mail est déja utilisé" });
   }

    var hashedPassword = await hashPassword(password);

    var html = `<h1>  Un compte avec votre mail vient d'être créé </h1>
                <p>vous pouvez dès maintenant vous connecter sur espace utilisateur , voici votre mail:
                ${email} et voici votre mot de pass  ${password}
    `
    try{
        await UserAdmin.addAdminUser(name, email, hashedPassword, avatar, profileId, 'yes');
        
        sendMail(
            email,
            'Sujet de test',
            html);
        return res.status(200).json({ error:false, message: " User added successly" });

    }catch(error)
    {
        console.log(error);
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

    
    async getAllPermissions(req, res) {
        try {
            const [users] = await UserAdmin.findAll();
            res.status(200).json({message:users});
        } catch (error) {
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
            
            res.status(500).json({ message: `Erreur serveur. ${error}` });
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
   
    async addRoles(req, res){
        const { name, permissions}  = req.body; 
       
        if (!name || !permissions) {
          return res.status(400).json({ error: 'Name and permission are required' });
        }
       
      
        try {
      
          const result = await UserAdmin.addPermissions(name, permissions);
      
          if (result.affectedRows > 0) {
            console.log('set done');

            return res.status(200).json({ message: 'Data added successfully' });
          } else {
            return res.status(500).json({ error: 'Failed to add data' });
          }
        } catch (error) {
          console.error('Erreur lors de l’ajout des données :', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

    },


    async updateRolesPermission(req, res){

        const ID              =  req.params.id;
        const {permissions}   =  req.body;

        try{

            await UserAdmin.updatePermissios(JSON.stringify(permissions), ID);
            res.status(200).json("200");

        }catch(error){
            console.log(error);
        }
    },

    async deleteRoles(req, res){

        try{
            await  UserAdmin.deleteRoles(req.params.id);
        }
        catch(error){
            console.log(error);
        }
    },
    
    async login(req, res) {
        const { email, password } = req.body;
      

        try {
            //validator joi

            const { error } = loginValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const [rows] =  await UserAdmin.findByEmail(email);


        
          if (rows.length === 0) {

            return res.status(404).json({ error: 'Utilisateur non trouvé.' });

          }

          const user = rows[0];
     

          const passwordMatch =  await verifyPassword(user.password, password);
     
        
          if (!passwordMatch) {
            
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
          }
          // generate the token 
          const token = generateToken({ id: user.id, email: user.email});
          res.status(200).json({ message: user.id, isfirstTime: user.isfirsttime, token:token });


        } catch (error) {

      
          console.error('Erreur lors de la connexion :', error);
          res.status(500).json({ error: 'Erreur interne du serveur.' });
        }
      },

      async resetPassword(req, res){

        const { email } = req.body;

        const resetCode = Math.floor(100000 + Math.random() * 900000);
       
         try{

          var user = await UserAdmin.findByEmail(email);

          if(user.length == 0){

                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
          }

          user =  user[0];

         

          const resetCode = Math.floor(100000 + Math.random() * 900000);

          // set a new code reset 
          await  UserAdmin.resetCode(resetCode, email);

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
      },


      async verifyCode(req, res){
            const {email, code} =  req.body;
           
            try{
                const  response     =  await UserAdmin.verifyCode(email, code);

                if(response.length == 0 ){
                    return res.status(400).json({ error: 'Code invalide ou expiré.' });
                }

                res.status(200).json({ message: 'Code vérifié avec succès.' });

            }catch(error){

                console.error('Erreur lors de la vérification du code :', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            }
      },


      async setNewPassord(req, res){

        const {email, newPassword} = req.body;

        try{

            const hashedPassword = await hashPassword(newPassword);
            await UserAdmin.updateNewPassword(hashedPassword, email);

            
            res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });


            var html = `
                <h1>Mot de passe changé</h1>
                <p>Bonjour; </p>
                <p>Votre mot de passe a été changé : </p>
            
            `;
                sendMail(
                email,
                'Changement de mot de pase',
                html,
                
            );

        }catch(error){
            console.log(error);
        }
      },

    async getPermissions(req, res){

        try{
            const [permissions] = await UserAdmin.findAllPermissions();
            if(permissions){
                return res.status(200).json({ message: permissions});
            }
        }catch(error){
            console.log(error);
        }

    },

    async getAllUserAdmins(req, res){

        try{
            const [allUser] =  await UserAdmin.findAll();
            res.status(200).json(allUser);

        }catch(error){
             console.log(error);
        }
    },


    async updateUserInformation(req, res){
         try{

            let { name, email, password, avatar, profil_id } = req.body;
            const id = req.params.id
          
            try {
          
                if (password) {
                    const isHashed = password.startsWith("$argon2");
                    if (!isHashed) {
                      password = await hashPassword(password);
                    }
                  }

                await UserAdmin.updateUser(name, email, password, avatar, profil_id, id);
                res.status(200).json({ message: "Utilisateur mis à jour avec succès " });
          
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
            }

                
         }catch(error){
            console.log(error);
         }
    },

    async deleteUserInformation(req, res){

        const userId = req.params.id; // ID de l'utilisateur à supprimer

        const result =  UserAdmin.deleteUser(userId);
       
            if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        
    }

};

module.exports = userAdminController;
