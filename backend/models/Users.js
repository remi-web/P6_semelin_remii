const mongoose = require('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const validate = require ('./Validators')

const userSchema = mongoose.Schema({
    email: {type: String, required: true, validate: validate.emailValidator, unique: true, },
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


  
