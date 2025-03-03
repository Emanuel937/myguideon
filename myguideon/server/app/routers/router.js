const express = require('express');
const router = express.Router();


const usersAdminRouter = require('./useradminRoutes.js');
const destinationRouter = require('./destinationRoute.js');
const activitiesRouter = require('./activitiesRoutes.js');


router.use('/destination',destinationRouter);

router.use('/profil',usersAdminRouter);

router.use('/activities',activitiesRouter);


module.exports = router;