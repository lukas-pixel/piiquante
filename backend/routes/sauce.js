const express = require('express');
let router = express.Router();

let auth = require('../middleware/auth');
let stuffCtrl = require('../controllers/sauce');

router.post('/', auth, stuffCtrl.createSauce);
router.put('/:id', auth, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.get('/' + '', auth, stuffCtrl.getAllSauce);


module.exports = router;