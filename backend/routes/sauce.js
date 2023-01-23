const express = require('express');
let router = express.Router();

let auth = require('../middleware/auth');
let multer = require('../middleware/multer-config');
let saucesCtrl = require('../controllers/sauce');

// route qui permet de créer une sauce avec l'appelation du middleware multer
router.post('/', auth, multer, saucesCtrl.createSauce);
// route qui permet de modifier une sauce avec appelation du middleware multer
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// route qui permet de supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// route qui permet de récupérer une sauce séléctionnée
router.get('/:id', auth, saucesCtrl.getOneSauce);
// route qui permet de récupérer toutes les sauces
router.get('/', saucesCtrl.getAllSauce);
// route qui permet de liker ou disliker une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);


module.exports = router;