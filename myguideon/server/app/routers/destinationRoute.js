
const express                            = require('express');
const router                             = express.Router();
const destinationController              = require('../controllers/destinationController');
const uploadFile                         = require('../middleware/uploadFile');

router.get('/',                          destinationController.getAllDestinations);
router.get('/details/:id',               destinationController.getDestinationById);     
router.post('/add/basic/info',           destinationController.addDestination);
router.delete('/delete/:id',             destinationController.deleteDestination);
router.get('/:id',                       destinationController.destinationDetailsAdmin); 
router.post('/update/gallery/:id',       uploadFile("gallery"), destinationController.updateGallery);
router.post('/update/basic/info/:id',    destinationController.updateDestination);

module.exports = router;
