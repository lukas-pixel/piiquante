const jwt = require('jsonwebtoken');

////////// FONCTION POUR LE TOKEN //////////
module.exports = (req, res, next) => {
    try {
        // recuperation du token dans le header de la requête d'authorization
        let token = req.headers.authorization.split(" ")[1];
        // vérifie le token avec la clé secrète
        let decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // vérifie si le token dans le header authorization est le même que celui de l'utilisateur
        let userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch {
        // repond une erreur 401 si probleme d'authentification
        res.status(401).json({
            error: new Error('Invalid request !')
        });
    }
};