const express = require('express');
const { getUser} = require ('../controllers/userController.js');
const authMiddleWare = require('../middleware/authMiddleware.js');
const  verifyRole  = require('../middleware/roleMiddleWare')
const router = express.Router();


//route pour obtenir un utilisateur (protégé par authMiddleWare)
router.get('/profile',authMiddleWare,verifyRole(['ROLE_USER']),getUser);

module.exports = router;