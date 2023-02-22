const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const User = require('../models/user');

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

////////// FONCTION POUR CREER UN COMPTE //////////
exports.signup = (req, res, next) => {
  if(!emailValidator.validate(req.body.email) && !passwordSchema.validate(req.body.password)) {
    return res.status(401).json({ message: 'Veuillez saisir une adresse email valide et Le mot de passe ne doit pas contenir d\'espace et doit avoir une longueur entre 8 et 20 caractères contenant au minimum 1 chiffre, 1 minuscule et 1 majuscule'});
  }

    // appel bcrypt dans le mdp afin de 'saler' celui ci et on demande à l'agorithme de faire 10 tours afin de le securiser
    bcrypt.hash(req.body.password, 10)
        // récupération du hash
        .then(hash => {
            // création du compte
            const user = new User({
                // récupération de l'email et du mdp hashé présent dans le corps de la requête
                email: req.body.email,
                password: hash
            });
            // sauvegarde les identifiants dans la base de donnée
            user.save()
                // si aucune erreur répond 201 created et un message
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                // si erreur répond une erreur 400 et un message d'erreur
                .catch(error => res.status(400).json({ error }));
        })
        // si erreur répond une erreur 500 et un message d'erreur
        .catch(error => res.status(500).json({ error }));
};

////////// FONCTION POUR SE CONNECTER A UN COMPTE CREE //////////
exports.login = (req, res, next) => {
    // vérifie si l'email apparait bien dans la base de donnée
    User.findOne({ email: req.body.email})
        .then(user => {
            // si elle est introuvable répond une erreur 401 + message d'erreur
            if (user === null || user === undefined) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                // bcrypt compare le mot de passe de la base de donnée et celui en entrée
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            // si le mot de passe n'est pas valide réponds 401 + message d'erreur
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } else {
                            // si le mdp est validé reponse 200 + réponse json contenant l'Id de l'utilisateur et un token
                            res.status(200).json({
                                userId: user._id,
                                // attribution d'un token
                                token: jwt.sign(
                                    { userId: user._id },
                                    // clé d'encodage avec délais d'expiration
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '72h' }
                                )
                            });
                        }
                    })
                    // si erreur répond 500 + message d'erreur
                    .catch(error => res.status(500).json({ error }))
            }
        })
        // si erreur répond 500 + message d'erreur
        .catch(error => res.status(500).json({ error }));
};