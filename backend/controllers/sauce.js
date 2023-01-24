// schema de sauce.js
const Sauce = require("../models/ModelsSauces");
// importation du package file system pour modifier le système de fichiers
const fs = require('fs');

////////// FONCTION POUR CREER UNE SAUCE //////////
exports.createSauce = (req, res) => {
    // transforme la requête envoyée par le front en JSON
    let sauceObject = JSON.parse(req.body.sauce);
    // supprime l'ID moongoose généré par défaut
    delete sauceObject._id;
    // création du nouvel objet
    let sauce = new Sauce({
        // recup corps de la requête
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        // modif de L'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // sauvegarde du nouvel objet dans la base de donnée
    sauce.save()
        .then(() => {res.status(201).json({ message: 'Sauce enregistrée !'})})
        .catch(error => res.status(400).json({error}))
};

////////// FONCTION POUR MODIFIER UNE SAUCE DANS LA BASE DE DONNEE //////////
exports.modifySauce = (req, res) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /images
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {
                    // une fois que l'ancienne image est supprimé dans le dossier /images, on peut mettre à jour le reste
                    let sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        let sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée! '}))
            .catch(error => res.status(400).josn({ error }));
    }
    };

////////// FONCTION POUR SUPPRIMER UNE SAUCE DANS LA BASE DE DONNEE //////////
exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(req.auth.userId !== sauce.userId){
                res.status(403).json({message: `Non autorisé !`})
            } else{
                let filename = sauce.imageUrl.split("/").at(-1);
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

////////// FONCTION POUR CHOISIR UNE SAUCE //////////
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(( sauce ) => res.status(200).json( sauce ))
        .catch(( error ) => res.status(404).json({ error: error }));
};

////////// FONCTION POUR CHOISIR PLUSIEURS SAUCE //////////
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }));
};

////////// FONCTION POUR LIKE / DISLIKE UNE SAUCE //////////
exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(401).json({error: 'Sauce déjà liké'});
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }))
                }
            }
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(401).json({error: 'Sauce déjà disliké'});
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};