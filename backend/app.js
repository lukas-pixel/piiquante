const express = require('express');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://Luk3s:nH7ihkDoii3bq9wA@cluster-piiquante.gjoe9na.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/sauce', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;