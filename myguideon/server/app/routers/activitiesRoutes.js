const express = require('express');

const router = express.Router();

/********************************************IMPORT CONTROLLERS************************************ */
const {getAllActivities,
getActivityById,
addActivity,
updateActivity,
deleteActivity} = require('../controllers/activitiesController');

/********************************************ROUTES************************************ */

router.get('/', getAllActivities);

router.get('/:id', getActivityById);

router.post('/', addActivity);

router.put('/:id', updateActivity);

router.delete('/:id', deleteActivity);


/********************************************EXPORT MODULE************************************ */

module.exports = router;