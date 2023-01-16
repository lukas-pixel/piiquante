const express = require('express');
const mongoose = require('mongoose');
const Sauce = require('./models/ModelsSauces');
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

app.use(express.json());

module.exports = app;