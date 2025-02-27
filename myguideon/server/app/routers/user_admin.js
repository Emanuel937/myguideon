const express               = require('express');
const router                = express.Router();
const userAdminController   = require('../controllers/useradminController');

router.get('/',                userAdminController.getAllUserAdmins);
router.post('/add',            userAdminController.addUserAdmin);
router.delete('/delete/:id',   userAdminController.deleteUserAdmin);
router.put('/update/:id',      userAdminController.updateUserAdmin );
router.get('/user_profil/:id', userAdminController.getUserAdminById)
router.get('/show/admin_user', userAdminController.getAllUserAdmins);
router.post('/login',          userAdminController.login);
router.post('/send-reset-code', userAdminController.resetPassword)

module.exports = router;
