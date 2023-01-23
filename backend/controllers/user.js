const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

////////// FONCTION POUR CREER UN COMPTE //////////
exports.signup = (req, res, next) => {
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
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user === null || user === undefined) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '72h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }));
};