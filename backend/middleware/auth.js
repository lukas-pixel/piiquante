const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split('')[1];
        let decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        let userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Utilisateur non autorisé';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request !')
        });
    }
};