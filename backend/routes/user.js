const express = require('express');
const router = express.Router();

// importation du controllers user.js afin de relier les fonctions de ce dernier au routeur user.js
const userCtrl = require('../controllers/user');

// assignation des controllers aux routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exportation de la route
module.exports = router;
