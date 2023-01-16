//ajout de mongoose dans la base de donnée
const mongoose = require('mongoose');

// creation du schema des models de sauce
let sauceSchema = mongoose.Schema({
    name: { type: String, require: true},
    manufacturer: { type: String, require: true},
    description: { type: String, require: true },
    mainPepper: { type: string, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true },
    dislikes: { type: Number, require: true },
    userLiked: { type: [string], require: true },
    userDisliked: { type: [string], require: true }
});

//export du schéma en tant que modèle Mongoose et le rendant disponible sur app express
module.exports = mongoose.model('Sauce', sauceSchema);