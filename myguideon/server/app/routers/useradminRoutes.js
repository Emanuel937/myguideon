const express               = require('express');
const router                = express.Router();
const userAdminController   = require('../controllers/useradminController');
const auth                  = require('../middleware/auth');

router.get('/',                    userAdminController.getPermissions);            // get all permissions to check
router.post('/add',                userAdminController.addRoles);                 // add roles
router.delete('/delete/:id',       userAdminController.deleteRoles);             // update permissions of roles
router.put('/update/:id',          userAdminController.updateRolesPermission);  // update roles
router.get('/user_profil/:id',     userAdminController.getUserAdminById)
router.get('/show/admin_user',     userAdminController.getAllUserAdmins); 
router.post('/login',              userAdminController.login);
router.post('/send-reset-code',    userAdminController.resetPassword);
router.post('/verify-code',        userAdminController.verifyCode);
router.post('/reset-password',     userAdminController. setNewPassord);
router.post('/add/user/admin',     userAdminController.addUserAdmin);
router.put('/update/user/:id',     userAdminController.updateUserInformation);
router.delete('/user/delete/:id',  userAdminController.deleteUserInformation);

module.exports = router;
