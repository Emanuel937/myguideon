

const express              = require('express');
const router               = express.Router();
const usersAdmin           = require('./useradminRoutes.js');
const destination          = require('./destinationRoute.js');


//const activities                         = require('./things_to_do.js');
//const info                               = require('./info.js');
//router.use('/pratique/info',    info);

router.use('/destination',   destination);

router.use('/profil',      usersAdmin);


module.exports = router;