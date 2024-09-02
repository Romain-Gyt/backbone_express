const express = require('express');
const { createRole, getRoles} = require('../controllers/roleController');
const router = express.Router();

//route pour créer les roles
router.post('/',createRole);

//route pour obtenir tous les roles
router.get('/',getRoles);

module.exports = router