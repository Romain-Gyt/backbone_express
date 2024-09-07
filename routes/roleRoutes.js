const express = require('express');
const { createRole, getRoles} = require('../controllers/roleController');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.use(authenticate);


//route pour créer les roles
router.post('/',verifyRole(['ROLE_ADMIN']),createRole);

//route pour obtenir tous les roles
router.get('/',verifyRole(['ROLE_ADMIN']),getRoles);

module.exports = router