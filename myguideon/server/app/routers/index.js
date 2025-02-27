// This file handle all all router of all file
// then it is export to the app.js file ✅
// Servir le dossier 'public' comme contenu statique


const express              = require('express');
const router               = express.Router();
const usersAdmin            = require('./user_admin.js');
const destination          = require('./destination.js');
//const activities         = require('./things_to_do.js');
//const info               = require('./info.js');

// user router 
router.use('/destination',   destination);
//router.use('/activities',    activities);
router.use('/profil',      usersAdmin);
//router.use('/pratique/info',    info);

module.exports = router;