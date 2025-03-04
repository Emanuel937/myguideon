const express = require('express');
const router = express.Router();

// Import the routers****************************************************
const usersAdminRouter = require('./useradminRoutes.js');
const destinationRouter = require('./destinationRoute.js');
const activitiesRouter = require('./activitiesRoutes.js');
const userproRouter = require('./userproRoute.js');

// Use the routers****************************************************
router.use('/destination',destinationRouter);

router.use('/profil',usersAdminRouter);

router.use('/activities',activitiesRouter);

router.use('/userpro',userproRouter);

// Export the router****************************************************
module.exports = router;