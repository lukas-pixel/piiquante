const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet'); // module de sécurité http pour l'app helmet - installe des http headers différents

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));

const app = express();
// utilisation de helmet pour la sécurité
app.use(helmet());
// ajout du middleware express.json afin d'extraire le corps JSON pour la requête POST
app.use(express.json());
// Contourner les erreurs de CORS
app.use(cors());
// autorisation Cross-origin
app.use((req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin")
    next()
});

//charger des fichiers depuis dossier image
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;