const express = require('express');
let router = express.Router();

let stuffCtrl = require('../controllers/sauce');

router.post('/', stuffCtrl.createSauce);
router.put('/:id', stuffCtrl.modifySauce);
router.delete('/:id', stuffCtrl.deleteSauce);
router.get('/:id', stuffCtrl.getOneSauce);
router.get('/' + '', stuffCtrl.getAllSauce);


module.exports = router;