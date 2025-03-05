const express = require('express');
const router = express.Router();

/***********************IMPORT*********************************** */
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const uploadFile = require('../middleware/uploadFile');

const { 
    getAllUserPro,
    getUserProById,
    updateUserPro,
    updatePassword,
    deleteUserPro,
    loginUserPro,
    addUserPro 
} = require('../controllers/UserproController');

/***********************ROUTES PUBLIQUES*********************************** */
// 🔓 Route publique : Connexion
router.post('/login', loginUserPro);

// 🔓 Route publique : Inscription avec upload d'image
router.post('/register', uploadFile().single('profile_image'), addUserPro);

/***********************ROUTES PROTEGEES POUR USER CONNECTÉ*********************************** */
// 🔒 Récupérer ses propres infos
router.get('/me', authMiddleware(), getUserProById);

// 🔒 Mettre à jour ses propres infos
router.put('/me', authMiddleware(), uploadFile().single('profile_image'), updateUserPro);

// 🔒 Mettre à jour son propre mot de passe
router.put('/me/password', (req, res, next) => {
    next();
}, authMiddleware('update_password_userpro'), (req, res, next) => {

    next();
}, (req, res, next) => {
    next();
}, updatePassword);

/***********************ROUTES ADMIN SECURISEES*********************************** */
// 🔒 Récupérer tous les userpro (admin seulement)
router.get('/', (req, res, next) => {
    next();
}, authMiddleware('view_userpro'), adminMiddleware, getAllUserPro);

// 🔒 Récupérer un userpro par son id (admin seulement)
router.get('/:id', (req, res, next) => {
    next();
}, authMiddleware('view_userpro'), adminMiddleware, getUserProById);

// 🔒 Mettre à jour un userpro par son id (admin seulement)
router.put('/:id', authMiddleware('update_userpro'), adminMiddleware, uploadFile().single('profile_image'), updateUserPro);

// 🔒 Mettre à jour le mot de passe d'un userpro par son id (admin seulement)
router.put('/password/:id', authMiddleware('update_password_userpro'), adminMiddleware, updatePassword);

// 🔒 Supprimer un userpro par son id (admin seulement)
router.delete('/:id', (req, res, next) => {
    next();
}, authMiddleware('delete_userpro'), adminMiddleware, deleteUserPro);

/***********************EXPORT*********************************** */
module.exports = router;
