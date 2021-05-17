const validate = require ('mongoose-validator')
const passwordValidator = require('password-validator')

var schema = new passwordValidator();

    schema
    .is().min(8)           // Minimum length 8
    .is().max(100)         // Maximum length 100
    .has().uppercase()     // Must have uppercase letters
    .has().lowercase()     // Must have lowercase letters
    .has().digits(2)       // Must have at least 2 digits
    .has().not().spaces()  // Should not have spaces
    .is().not().oneOf(     // Blacklist these values
        ['Passw0rd', 'Password123','abcd123456','validPASS123']
    )

module.exports.passWordValidator = schema

module.exports.emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'entrez une adresse email valide',
    }),
  ]

