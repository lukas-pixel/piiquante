const express = require('express');
let router = express.Router();

let Sauce = require('../models/ModelsSauces');

router.post('/', (req, res, next) => {
    let sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        userLiked: req.body.userLiked,
        userDisliked: req.body.userDisliked
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Post saved successfully !'})})
        .catch(( error ) => { res.status(400).json({ error: error })});
});

router.get('/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(( sauce ) => res.status(200).json( sauce ))
        .catch(( error ) => res.status(404).json({ error: error }));
});

router.put('/:id', (req, res, next) => {
    let sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        userLiked: req.body.userLiked,
        userDisliked: req.body.userDisliked
    });
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(201).json({ message: 'Thing updated successfully !'}))
        .catch((error) => res.status(400).json({ error: error }));
});

router.delete('/:id', (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce Deleted !'}))
        .catch((error) => res.status(400).json({ error: error }));
});

router.get('/' + '', (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }));
});


module.exports = router;