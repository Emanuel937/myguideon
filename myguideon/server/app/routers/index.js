

const express              = require('express');
const router               = express.Router();
const usersAdmin           = require('./useradminRoutes.js');
const destination          = require('./destinationRoute.js');
const thingtodoRouter      = require('./thingtodoRoute.js');
const authMiddleware       = require('../middleware/auth.js');

router.use('/destination',   destination);
router.use('/profil',        usersAdmin);
router.use('/thingtodo',     thingtodoRouter);


router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({ message: "✅ Authenticated!", user: req.session.user });
});

module.exports = router;