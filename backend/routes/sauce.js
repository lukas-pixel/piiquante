const express = require('express');
let router = express.Router();

let auth = require('../middleware/auth');
let multer = require('../middleware/multer-config');
let saucesCtrl = require('../controllers/sauce');

router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/' + '', auth, saucesCtrl.getAllSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);


module.exports = router;