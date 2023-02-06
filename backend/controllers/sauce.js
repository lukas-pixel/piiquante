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
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              //recup du deuxième element du tableau constitué du avant/après '/images/'
              let filename = sauce.imageUrl.split('/images/')[1];
              // supprime le après '/images/' et début du callback
              console.log('MARINE IMAGE URL => ', sauce.imageUrl)
              fs.unlink(`images/${filename}`, () => console.log('Image supprimée !'))
          })

}
    // on verifie si l'objet existe
    let sauceObject = req.file ? {
        //recup du corps de le requete
        ...JSON.parse(req.body.sauce),

        // traitement de la nouvelle image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
        // sinon on modifie juste le corps de la requête
        : { ...req.body }
    // modif de la sauce dans la base de donnée
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    // rep 200 + message
      .then(() => res.status(200).json({ message: 'Article modifiée !'}))
      //erreur 400
      .catch(error => res.status(400).json({ error: error }));
    };

////////// FONCTION POUR SUPPRIMER UNE SAUCE DANS LA BASE DE DONNEE //////////
exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(req.auth.userId !== sauce._id){
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
exports.getOneSauce = async (req, res, next) => {
    try {
        var sauce = await Sauce.findOne({_id: req.params.id})
            res.status(200).json(sauce)
    } catch( error ) { res.status(404).json({ error: error }) }
};

////////// FONCTION POUR CHOISIR PLUSIEURS SAUCE //////////
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }));
};

////////// FONCTION POUR LIKE / DISLIKE UNE SAUCE //////////
exports.likeSauce = (req, res) => {
    // recup like présent dans le body (0 par défaut)
    let like = req.body.like;
    // recup user ID présent dans le body
    let userId = req.body.userId;
    // cas si l'utilisateur like
    if (like === 1) {
        // modif de la sauce dans la BD push de L'ID utilisateur dans le tableau et incrémentation du like dans le compteur de like
        Sauce.updateOne( { _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 }})
        // rep 200 + message
          .then(() => res.status(200).json({ message: "Votre like a été pris en compte !"}))
        // erreur rep 400
          .catch(error => res.status(400).json({ error: error }));
    }
    // cas si l'utilisateur dislike
    else if (like === -1) {
        // modif de la sauce dans la BD push de L'ID utilisateur dans le tableau et incrémentation du dislike dans le compteur de dislike
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 }})
        // rep 200 + message
          .then(() => res.status(200).json({ message: "Votre dislike a été pris en compte !"}))
        // erreur 400
          .catch(error => res.status(400).json({ error: error }));
    }
    // cas si l'utilisateur enlève son like ou son dislike
    else if (like === 0) {
        Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              // cas si l'utilisateur enlève son like
              // on verifie que l'ID de l'utilisateur apparait bien dans le tableau usersLiked
              if (sauce.usersLiked.includes(userId)) {
                  // modif de la sauce, incrémentation du like retiré dans le compteur like et retire l'ID de l'utilisateur dans le tableau usersLiked
                  Sauce.updateOne({ _id: req.params.id }, {$inc: { likes: -1 }, $pull: { usersLiked: userId}})
                  // rep 200 + message
                    .then(() => res.status(200).json({ message: "Votre like à bien été supprimé !"}))
                  // erreur 400
                    .catch(error => res.status(400).json({ error: error }));
              }
              // cas si utilisateur enleve son dislike
              // on verifie que l'ID de l'utilisateur apparait bien dans le tableau usersLiked
              if (sauce.usersDisliked.includes(userId)) {
                  // modif de la sauce, incrémentation du dislike retiré dans le compteur dislike et retire l'ID de l'utilisateur dans le tableau usersDisliked
                  Sauce.updateOne({ _id: req.params.id },  {$inc: { dislikes: -1 }, $pull: { usersDisliked: userId}})
                  // rep 200 + message
                    .then(() => res.status(200).json({ message: "Votre dislike à bien été supprimé !"}))
                  // erreur 400
                    .catch(error => res.status(400).json({ error: error }))
              }
          })
        // erreur 500
          .catch(error => res.status(500).json({ error: error }))
    }
};