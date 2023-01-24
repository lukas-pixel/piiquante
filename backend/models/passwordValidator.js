const passwordValidator = require('password-validator');

//modele de password

let passwordSchema = new passwordValidator();

//propriétés du password
passwordSchema
.is()
.min(8) //minimum 8 caract
.is()
.max(30) //maxi 30 caract
.has()
.uppercase(1) // doit avoir 1 maj
.has()
.digits(2) //doit avoir au moins 2 chiffres
.has()
.not() // ne doit pas contenir d'espaces
.spaces()
.is()
.not()
.oneOf(["Passw0rd", "Password123"]); //liste de passwords exclus

module.exports = passwordSchema;