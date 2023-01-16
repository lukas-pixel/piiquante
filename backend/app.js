const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://Luk3s:nH7ihkDoii3bq9wA@cluster-piiquante.gjoe9na.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//ajout de middleware
app.use('/api/sauce', (req, res, next) => {
    let sauce = [
        {
            userId: 'id MongoDb',
            name: 'nom de la sauce',
            manufacturer: 'fabricant de la sauce',
            description: 'description sauce',
            mainPepper: 'le principal ingrédient épicé de la sauce',
            imageUrl: 'url image',
            heat: '(Number) nombre de 1 à 10 pour décrire la sauce',
            likes: '(Number) Nbr d\'utilisateur qui aime la sauce',
            dislikes: '(Number) Nbr d\'utilisateur qui n\'aiment pas la sauce',
            userLiked: '(String + userId) - tableau des id des utilisateurs qui ont aimé',
            userDisliked: '(String + userId) - tableau des id des utilisateur qui n\'ont pas aimé'
        },
    ];
    res.status(200).json(sauce);
});

module.exports = app;