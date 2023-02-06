const express = require('express');
let router = express.Router();

let auth = require('../middleware/auth');
let multer = require('../middleware/multer-config');
let sauce = require('../controllers/sauce');

// route qui permet de créer une sauce avec l'appelation du middleware multer
router.post('/', auth, multer, sauce.createSauce);
// route qui permet de modifier une sauce avec appelation du middleware multer
router.put('/:id', auth, multer, sauce.modifySauce);
// route qui permet de supprimer une sauce
router.delete('/:id', auth, sauce.deleteSauce);
// route qui permet de récupérer une sauce séléctionnée
router.get('/:id', auth, sauce.getOneSauce);
// route qui permet de récupérer toutes les sauces
router.get('/', sauce.getAllSauce);
// route qui permet de liker ou disliker une sauce
router.post('/:id/like', auth, sauce.likeSauce);


module.exports = router;