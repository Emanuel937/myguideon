const express = require('express');

const router = express.Router();

/********************************************IMPORT************************************ */

const uploadFile = require('../middleware/uploadFile');

const {getAllActivities,
getActivityById,
addActivity,
updateActivity,
deleteActivity} = require('../controllers/activitiesController');

/********************************************ROUTES************************************ */

router.get('/', getAllActivities);

router.get('/:id', getActivityById);

router.post('/', uploadFile().fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]), addActivity);

router.put('/:id',uploadFile().fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]) ,updateActivity);

router.delete('/:id', deleteActivity);


/********************************************EXPORT MODULE************************************ */

module.exports = router;