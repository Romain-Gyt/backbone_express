const express = require('express');
const { getUser} = require ('../controllers/userController.js');
const authMiddleWare = require('../middleware/authMiddleware.js');
const { authorizeRole } = require('../middleware/authorizeRole')
const router = express.Router();


//route pour obtenir un utilisateur (protégé par authMiddleWare)
router.get('/profile',authMiddleWare,authorizeRole('ROLE_USER'),getUser);

module.exports = router;