const express = require('express');
let router = express.Router();

let auth = require('../middleware/auth');
let multer = require('../middleware/multer-config');
let stuffCtrl = require('../controllers/sauce');

router.post('/', auth, multer, stuffCtrl.createSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.get('/' + '', auth, stuffCtrl.getAllSauce);


module.exports = router;