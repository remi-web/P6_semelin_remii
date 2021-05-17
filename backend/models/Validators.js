const validate = require ('mongoose-validator')
const passwordValidator = require('password-validator')

var schema = new passwordValidator();

    schema
    .is().min(8)           // Minimum de 8 caractères
    .is().max(100)         // Maximun 100 caractères
    .has().uppercase()     // Au moins une majuscule
    .has().lowercase()     // Au moins une minuscule
    .has().digits(2)       // Au moins deux chiffres
    .has().not().spaces()  // Pas d'espace
    .is().not().oneOf(     // Mot de passes blaclistés
        ['Passw0rd', 'Password123','abcd123456','validPASS123']
    )

module.exports.passWordValidator = schema

module.exports.emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'entrez une adresse email valide',
    }),
  ]

