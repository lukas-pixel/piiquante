const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

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
app.use(express.json());
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;