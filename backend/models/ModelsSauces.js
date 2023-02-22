//ajout de mongoose dans la base de donnée
const mongoose = require('mongoose');

// creation du schema des models de sauce
let saucesSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

//export du schéma en tant que modèle Mongoose et le rendant disponible sur app express
module.exports = mongoose.model('sauces', saucesSchema);