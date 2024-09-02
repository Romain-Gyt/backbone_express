const express = require('express');
const { login,register } = require ('../controllers/authController.js');
const router = express.Router();

//Route pour l'identification
router.post('/register',register)

//route pour la connexion
router.post('/login',login);

module.exports = router;