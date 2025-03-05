const express               = require('express');
const router                = express.Router();
const thingtodoController   = require('../controllers/thingtoDoController');
const uploadFile            = require('../middleware/uploadFile');


router.post('/add', uploadFile("thingtodo"), thingtodoController.addThingtoDo);                

module.exports = router;
